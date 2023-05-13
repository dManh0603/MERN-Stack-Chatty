const userRouter = require('./UserRouter')
const errorHanlder = require('../middlewares/ErrorHandler')


function route(app) {

    app.use('/api/user', userRouter)

    app.use(errorHanlder._404)
    app.use(errorHanlder._500)
}

module.exports = route