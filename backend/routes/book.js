const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage
})

// import model
const Book = require('../models/book')

router.get('', async (req, res) => {
    // console.log('helloooooo')
    try {
        const books = await Book.find({})

        // no books found
        if (books && books.length === 0) {
            return res.status(404).send({ error: 'no books were found' }) // return is important because we stop the execution flow
        }

        // everything went fine
        return res.send(books)
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })

        if (!book) {
            return res.status(404).send({ error: 'book with id cannot be found' })
        }

        return res.send(book)
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.post('', upload.single('image'), (req, res) => {
    // catch when there is some error happen when we connect to cloudinary
    try {
        cloudinary.uploader.upload(req.file.path, { use_filename: true }, async (error, result) => {

            if (error) {
                // console.log('got an error')
                return res.status(500).send({ error: error })
            }

            const book = new Book({ ...req.body })
            book.image = result.secure_url
            book.url = result.secure_url
            book.cloudinary.public_id = result.public_id
            // console.log('before saving to database')
            book.save().then(doc => {
                // console.log('created book succesfully')
                return res.status(201).send(book)
            }).catch(e => {
                // when something happend to save that book to database
                return res.status(500).send({ error: e })
            })
        })
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).send({ error: 'Bad Request' })
        }
        const book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })

        // book not found with given id
        if (!book) {
            return res.status(404).send({ error: 'Unable to update book' })
        }

        return res.send(book)

    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id
        })

        if (!book) {
            return res.status(404).send({ error: 'book with id cannot be deleted' })
        }

        // console.log(book)

        // book available so try to delete it from cloudinary image and book in database
        cloudinary.uploader.destroy(book.cloudinary.public_id, (error, result) => {
            if (error) {
                // console.log(error)
                return res.status(500).send({ error: error })
            }

            book.remove().then(data => {
                // console.log('REMOVED DOCUMENT')
                // console.log(data)
            }).catch(e => {
                // console.log('Error removing docu')
                return res.status(500).send({ error: e })
            })

            return res.send(book)
        })

    } catch (e) {
        res.status(500).send({ error: e })
    }
})

module.exports = router