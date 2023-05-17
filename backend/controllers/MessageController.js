const Message = require('../models/MessageModel')
const Chat = require('../models/ChatModel')
const User = require('../models/UserModel');

class MessageController {
  sendMessage = async (req, res) => {
    
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      console.log('Invalid data passed into request');
      return res.status(400).json({ message: 'Invalid data passed into request' });
    }

    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId
    }

    try {
      let message = await Message.create(newMessage);
      message = await message.populate('sender', 'name avt');
      message = await message.populate('chat');
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'name avt email',
      })

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });

      res.json(message);
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
  }

  fetchMessages = async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.id })
        .populate('sender', 'name avt email')
        .populate('chat')

      res.json(messages);
    } catch (error) {
      console.error(error)
      res.status(500)
      throw new Error(error.message)
    }

  }

}

module.exports = new MessageController;