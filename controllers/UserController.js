import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Role from "../models/Role.js";

export const registerUser = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const userRole = await Role.findOne({value: "USER"})

        const doc = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash,
            avatarUrl: req.body.avatarUrl,
            vkUrl: req.body.vkUrl,
            role: userRole.value
        })

        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id
            }, 'secret',
            {
                expiresIn: '30d'
            })

        res.json({...user._doc, token})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const registerPublish = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const publishRole = await Role.findOne({value: "PUBLISH"})
        console.log()

        const doc = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash,
            avatarUrl: req.body.avatarUrl,
            vkUrl: req.body.vkUrl,
            role: publishRole.value
        })

        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id
            }, 'secret',
            {
                expiresIn: '30d'
            })

        res.json({...user._doc, token})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
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

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя нет'
            })
        }

        res.json({
            ...user._doc
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Нет доступа '
        })
    }
}

export const getUser = async (req, res) => {
    try{
        const {id} = req.params

        const user = await User.findById(id).populate('likedPost').exec()

        console.log(user);

        res.json(user)
    }catch (e) {
        res.json(e)
        console.log(e)
    }
}