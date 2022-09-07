import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const register = async (req, res) => {
    try {
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
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req,res) => {
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
}

export const getMe = async (req,res) => {
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
}