const express = require('express')
const route = require('./routes')
const dotenv = require('dotenv')

const app = express()
dotenv.config()


route(app)



const PORT = process.env.PORT || 8080
app.listen(PORT, console.log(`Serser listening at port ${PORT}`))