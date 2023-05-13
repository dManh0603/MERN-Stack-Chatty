const chats = require('../data/dummy data')


function route(app) {
    app.use('/api/chat/:id', (req, res, next) => {
        const singleChat = chats.find((c) => c._id === req.params.id)
        res.send(singleChat)
    })

    app.use('/api/chat', (req, res, next) => {
        res.send(chats)
    })


    app.use('/', (req, res, next) => {
        res.json("hello")
    })



}

module.exports = route