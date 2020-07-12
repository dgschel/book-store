require('dotenv').config()
require('./config/db') // start mongoose connection at startup 
require('./config/cloudinary')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const app = express()

const dist = path.join(__dirname, '../dist/')

app.use(express.static(dist))

// import routes
const books = require('./routes/book')

const port = process.env.PORT || 3000

// using third party middlewares
app.use(cors()) // to be able to make requests from frontend to backend
app.use(bodyParser.json()) // access payload in req.body <- new property by body-parser
app.use(bodyParser.urlencoded({ extended: true })) // not exactly sure what this does

// define routes
app.use('/api/books/', books)

app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})