import {body} from 'express-validator';

export const postValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10}).isString(),
    // body('url', 'Неверная ссылка').isString()
];
