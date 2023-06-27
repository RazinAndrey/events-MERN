/* middleware - функция посредник - она решит 
можно ли возвращать какую то секретную инфу или некльзя; 
оно смотрит авторизован пользователь или нет */

// подключаем библиотеку 'jsonwebtoken' для генерации token 
import jwt from 'jsonwebtoken';

// cоздаем функцию middleware (проверка авторизации)
export default (req, res, next) => {
    // получаем полученный токен
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token) {  
        try {
            // расшифровываем токен
            const decoded = jwt.verify(token, process.env.JWT);
            // передаем в запрос, то что расшифровали, а именно id
            req.userId = decoded.id;
            // переходим к другой операции 
            next();
        } catch (err){
            return res.json({
                message: 'Нет доступа', 
            });
        }
    } else {
        return res.json({
            message: 'Нет доступа'
        });
    }
} 