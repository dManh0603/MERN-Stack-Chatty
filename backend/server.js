const express = require('express')
const route = require('./routes')
const dotenv = require('dotenv')
const db = require('./config/db')

const app = express()

app.use(express.json())

dotenv.config()

db.connect()

route(app)



const PORT = process.env.PORT || 8080
app.listen(PORT, console.log(`Serser listening at port ${PORT}`))