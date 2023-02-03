import express from 'express'
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from "fs";

import {registerValidation, loginValidation, postCreateValidation} from './validations/validation.js'
import checkAuth from './utils/checkAuth.js'
import handleErrors from './utils/handleErrors.js'
import {getMe, login, registerUser, registerPublish, getUser} from "./controllers/UserController.js";
import {
    create,
    getAll,
    getOne,
    remove,
    update,
    getLastTags,
    getAllPopulate,
    getPostsOnTag,
} from "./controllers/PostController.js";
import {createComment, commentsOnPost, getLastComments} from "./controllers/CommentsController.js";
import {likePost, getLikesOnPost, getLikedPostUser} from "./controllers/LikeController.js";


const app = express()
dotenv.config()
const PORT = process.env.PORT || 4444

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads')
        }
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
app.post('/auth/registerUser', registerValidation, handleErrors, registerUser)
app.post('/auth/registerPublish', registerValidation, handleErrors, registerPublish)
app.get('/auth/me', checkAuth, getMe)

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', getLastTags)
app.get('/tags/:tag', getPostsOnTag)

app.post('/getUserData/:id', getUser)

app.post('/comments/:id', checkAuth, createComment)
app.get('/lastComments', getLastComments)
app.get('/comments/:id', commentsOnPost)

app.get('/posts', getAll)
app.get('/posts/populate', getAllPopulate)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleErrors, update)

app.post('/like/:id', checkAuth, likePost)
app.get('/likes/:id', getLikesOnPost)
app.get('/liked', checkAuth, getLikedPostUser)


const start = async () => {
    try {
        await mongoose
            .connect('mongodb+srv://beck17:wwwwww@cluster0.qygay.mongodb.net/blog?retryWrites=true&w=majority',)
            .then(() => console.log('DB OK'))
            .catch(e => console.log('DB ERROR' + e))

        await app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
}

start()