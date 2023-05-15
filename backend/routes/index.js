const userRouter = require('./UserRouter')
const chatRouter = require('./ChatRouter')
const errorHanlder = require('../middlewares/ErrorHandler')


function route(app) {

    app.use('/api/user', userRouter)
    app.use('/api/chat', chatRouter)

    app.get('/chats', (req, res)=>{
        res.json({ message: 'hi' })
    })
    app.use(errorHanlder._404)
    app.use(errorHanlder._500)
}

module.exports = route