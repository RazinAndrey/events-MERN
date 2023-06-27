/* подключаем функцию body из библиотеки 'express-validator' 
с ней будем проверять тело информации нашего запроса */
import { body } from 'express-validator';

// login-validation
export const loginValidation = [
    body('login').isLength({ min: 3}),
    body('password').isLength({ min: 3}),
];

// register-validation
export const registerValidation = [
    body('fullName').isLength({ min: 3}),
    body('login').isLength({ min: 3}),
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({ min: 3})
];
