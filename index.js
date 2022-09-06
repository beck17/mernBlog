import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt'

import {registerValidation} from './validations/auth.js'

import User from './models/User.js'
import checkAuth from './utils/checkAuth.js'


mongoose
    .connect('mongodb+srv://beck17:wwwwww@cluster0.qygay.mongodb.net/blog?retryWrites=true&w=majority',)
    .then(() => console.log('DB OK'))
    .catch(e => console.log('DB ERROR' + e))

const app = express()

app.use(express.json())


app.post('/auth/login', async (req,res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
                _id: user._id
            }, 'secret',
            {
                expiresIn: '30d'
            })

        res.json({...user._doc, token})

    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const doc = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash,
            avatarUrl: req.body.avatarUrl,
            vkUrl: req.body.vkUrl
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secret',
            {
                expiresIn: '30d'
            })

        res.json({...user._doc, token})
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
})

app.get('/auth/me', checkAuth,async (req,res) => {
    try{
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя нет'
            })
        }
        res.json({
            ...user._doc
        })
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Нет доступа '
        })
    }
})


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("Server OK")
})