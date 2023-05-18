const userRouter = require('./UserRouter')
const chatRouter = require('./ChatRouter')
const errorHanlder = require('../middlewares/ErrorHandler')
const messageRouter = require('../routes/MessageRouter')

function route(app) {

    app.use('/api/user', userRouter)
    app.use('/api/chat', chatRouter)

    app.use('/api/message', messageRouter)

    // app.use(errorHanlder._404)
    // app.use(errorHanlder._500)
}

module.exports = route