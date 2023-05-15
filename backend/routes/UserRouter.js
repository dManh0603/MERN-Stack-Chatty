const express = require('express')
const userController = require('../controllers/UserController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.post('/signup', userController.register)
router.post('/login', userController.login)

router.get('/', authenticate, userController.search)

module.exports = router