const express = require('express')
const authenticate = require('../middlewares/Authentication')
const messageController = require('../controllers/MessageController')

const router = express.Router()

router.get('/:id', authenticate, messageController.fetchMessages)
router.post('/', authenticate, messageController.sendMessage)



module.exports = router