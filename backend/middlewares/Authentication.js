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

            const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id).select('-password');
            next()
        } catch (error) {
            res.status(401);
            throw new Error("Unauthorized, failed token!");
        }
    }
    if(!encodedToken){
        res.status(401);
        throw new Error("Unauthorized, please login first!");
    }
}

module.exports = authenticate