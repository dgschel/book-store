const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: true,
        trim: true
    },
    isbn13: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    cloudinary: {
        public_id: {
            type: String,
            trim: true
        }
    }
})

const bookModel = mongoose.model('Book', bookSchema)

module.exports = bookModel