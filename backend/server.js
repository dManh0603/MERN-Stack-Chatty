const express = require('express')
const route = require('./routes')
const dotenv = require('dotenv')
const db = require('./config/db')
const path = require('path')
const { Server } = require('socket.io')


const app = express()

app.use(express.json())

dotenv.config()

db.connect()

route(app)

// -------------Production-------------------//
const dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(dirname, 'frontend','build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(dirname, 'frontend', 'build', 'index.html'))
  })

} else {
  app.get('/', (req, res) => {
    res.send('API Server is running');
  })
}

const PORT = process.env.BE_PORT || 8080

const server = app.listen(PORT, console.log(`Serser listening at port ${PORT}`))

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: `http://localhost:${process.env.FE_PORT}`
  }
})

io.on("connection", (socket) => {

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit(`connected`)
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log('user joined room: ', room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessage) => {
    let chat = newMessage.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user => {

      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit('message received', newMessage)
    });
  })

})


