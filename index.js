import express from 'express'
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'
import pdf from 'html-pdf'
import excelJs from 'exceljs'
import fs from 'fs'

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
import {fileURLToPath} from "url";
import {dirname} from "path";
import pdfTemplate from './doc/index.js'

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


app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
});

app.get('/fetch-pdf', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    res.sendFile(`${__dirname}/result.pdf`)
})

app.post('/create-exel', async (req, res) => {
    try {
        const {fullName, email, vkUrl} = req.body
        console.log(req.body);
        let workbook = new excelJs.Workbook()

        const sheet = workbook.addWorksheet('user')
        sheet.columns = [
            {header: 'Name', key: 'name', width: 25},
            {header: 'Email', key: 'email', width: 25},
            // {header: 'Кол-во лайков', key: 'likes', width: 25},
            {header: 'Vk', key: 'vk', width: 25},
            // {header: 'Date', key: 'date', width: 25}
        ]

        sheet.addRow({
            name: fullName,
            email: email,
            vk: vkUrl,
            // date: createdAt.date,
            // likes: likedPost.length
        })

        res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition","attachment;filename" + "=user.xlsx")

        await workbook.xlsx.write(res)
    } catch (e) {
        console.log(e);
    }
})


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("Server OK")
})