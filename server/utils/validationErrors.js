// подключаем функцию из библиотеки express-validator для проверки данных
import { validationResult } from 'express-validator';

// функция middleware - validationErrors (обрабатывает ошибки проверки) 
export default (req, res, next) => {
    // получаем все ошибки в запросе
    const errors = validationResult(req);
    // если ошибки есть, то...
    if (!errors.isEmpty()) {
        // выводим сообщение об ошибку
        return res.json({ 
            message: "Проверьте заполнение полей."
        });     
    }
    // переходим к другой операции 
    next();
}