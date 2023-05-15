const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authenticate = async (req, res, next) => {
    let encodedToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            encodedToken = req.headers.authorization.split(' ')[1]
            if (!encodedToken) {
                throw { statusCode: 401, message: 'Please login first!' }
            }
            const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id).select('-password');
            next()
        } catch (error) {
            console.error(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || 'Internal server error';
            res.status(statusCode).json({ error: message });
        }
    }

}

module.exports = authenticate