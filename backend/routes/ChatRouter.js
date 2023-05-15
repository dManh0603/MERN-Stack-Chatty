const express = require('express')
const authenticate = require('../middlewares/Authentication')
const chatController = require('../controllers/ChatController')

const router = express.Router()

router.get('/',authenticate, chatController.fetchChats)

router.post('/',authenticate, chatController.accessChat)
router.post('/group', authenticate, chatController.createGroup)

router.put('/group/rename', authenticate, chatController.renameGroup)
router.put('/group/remove', authenticate, chatController.removeFromGroup)
router.put('/group/add', authenticate, chatController.addToGroup)



module.exports = router