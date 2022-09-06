import {body} from "express-validator";

export const registerValidation = [
    body('email','Некорректный Email').isEmail(),
    body('password','Пароль минимум 5 символов').isLength({min: 5}),
    body('fullName','Укажите имя не менее 3 символов').isLength({min: 3}),
    body('avatar','Неверная ссылка на фотографию').optional().isURL(),
    body('vkUrl','Неверная ссылка на ВК').optional().isURL({
        protocols: ['https']
    })
]
