import express from 'express'
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'

import {registerValidation, loginValidation, postCreateValidation} from './validations/validation.js'
import checkAuth from './utils/checkAuth.js'
import handleErrors from './utils/handleErrors.js'
import {register, getMe, login} from "./controllers/UserController.js";
import {create, getAll, getOne, remove, update, getLastTags} from "./controllers/PostController.js";


mongoose
    .connect('mongodb+srv://beck17:wwwwww@cluster0.qygay.mongodb.net/blog?retryWrites=true&w=majority',)
    .then(() => console.log('DB OK'))
    .catch(e => console.log('DB ERROR' + e))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleErrors, login)
app.post('/auth/register', registerValidation, handleErrors, register)
app.get('/auth/me', checkAuth, getMe)

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', getLastTags)

app.get('/posts', getAll)
// app.get('/posts/tags', getLastTags)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleErrors, update)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("Server OK")
})