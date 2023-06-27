// подключаем библиотеку 'jsonwebtoken' для генерации token 
import jwt from 'jsonwebtoken';

export default (roles) => {
    // возвращаем функцию замыкания
    return function (req, res, next) {   
        try {
            // получаем полученный токен
            const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
            if(!token) {
                return res.json({
                    message: 'Нет доступа'
                });
            }
            // расшифровываем токен
            const { roles: userRoles } = jwt.verify(token, process.env.JWT);
            // проверяем роль пользователя
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if(!hasRole){
                return res.json({
                    message: 'Нет доступа'
                });
            }
            // переходим к другой операции 
            next();
        } catch (err){
            return res.json({
                message: 'Нет доступа' 
            });
        }
    }

} 