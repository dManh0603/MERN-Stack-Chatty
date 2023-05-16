const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

class ChatController {
  async accessChat(req, res, next) {
    const { userId } = req.body;

    if (!userId) {
      throw { statusCode: 400, message: 'No user id was provided!' }
    }

    try {
      let chats = await Chat.find({
        isGroupChat: false,
        users: { $all: [req.user._id, userId] }
      })
        .populate('users', '-password')
        .populate('latestMessage')
        .populate({
          path: 'latestMessage.sender',
          select: 'name avt email'
        });

      if (chats.length === 0) {
        const chatData = {
          chatname: 'sender',
          users: [req.user._id, userId],
        };
        const createdChat = await Chat.create(chatData);

        const fullChat = await Chat.findById(createdChat)
          .populate('users', '-password')
          .populate({
            path: 'latestMessage.sender',
            select: 'name avt email'
          });

        chats = [fullChat];
      }

      res.send(chats[0]);
    } catch (error) {
      console.error(error);
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      res.status(statusCode).json({ error: message });
    }
  }

  async fetchChats(req, res, next) {
    try {
      const results = await Chat.find({
        $or: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          // { groupAdmin: req.user._id }
        ]
      })

        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate({
          path: 'latestMessage',
          populate: {
            path: 'sender',
            select: 'name avt email',
          },
        })
        .sort({ updatedAt: -1 })
        .exec();

      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }


  async createGroup(req, res, next) {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: 'Please fill all the fields' });
    }

    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).send({ message: 'More than 2 users are required to form a group chat' })
    }

    users.push(req.users);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      })

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

      res.status(200).json(fullGroupChat)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  }

  async renameGroup(req, res, next) {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    if (!updatedChat) {
      res.status(400).json({ statusCode: 400, message: 'Bad request' });
      return;
    }
    res.json(updatedChat);
  }

  async addToGroup(req, res, next) {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    if (!added) {
      res.status(400).json({ message: 'Something wrong. Please try again later!' })
      return
    }
    res.json(added)
  }

  async removeFromGroup(req, res, next) {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    if (!removed) {
      res.status(400).json({ message: 'Something wrong. Please try again later!' })
      return
    }
    res.json(removed)
  }
}


module.exports = new ChatController;
