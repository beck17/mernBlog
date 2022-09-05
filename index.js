import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
// import bcrypt from 'bcrypt'

// import User from 'models/User'

mongoose
    .connect('mongodb+srv://beck17:wwwwww@cluster0.qygay.mongodb.net/?retryWrites=true&w=majority',)
    .then(() => console.log('DB OK'))
    .catch(e => console.log('DB ERROR' + e))

const app = express()

app.use(express.json())

app.post('/auth/register', (req, res) => {
    const token = jwt.sign({
        fullName: req.body.fullName,
        email: req.body.email,
        passwordHash: req.body.password,
        avatarUrl: req.body.avatarUrl
    }, 'secret')

    res.json({
        token
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("Server OK")
})