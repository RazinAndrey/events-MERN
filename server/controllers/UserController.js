// подключаем модели 
import UserModel from '../models/User.js';
import RoleModel from '../models/Role.js';
// подключаем библиотеку 'bcrypt' для шифрования пароля
import bcrypt from 'bcrypt';
// подключаем библиотеку 'jsonwebtoken' для генерации token 
import jwt from 'jsonwebtoken';


// регистрация
export const register = async (request, response) => {
    try {
        

        // получаем полученный email
        const email = request.body.email;
        // проверяем email на наличие одинакового в БД
        const isEmail = await UserModel.findOne({ email });
        if(isEmail) {
            return response.json({
                message: "Данный 'Email' уже занят."
            });
        }

        // получаем полученный login
        const login = request.body.login;
        // проверяем login на наличие одинакового в БД
        const isLogin = await UserModel.findOne({ login });
        if(isLogin) {
            return response.json({
                message: "Данный 'Login' уже занят."
            });
        }
        
        // получаем полученный пароль
        const password = request.body.password;
        // шифруем пароль (хешируем пароль)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // вытаскиваем роль
        const roles = await RoleModel.findOne({ roleName: "TEACHER"});
        // создаем экземпляр пользователя с помощью нашей модели в БД
        const newUser = new UserModel({
            roles: [roles.roleName], 
            fullName: request.body.fullName,
            login,
            email,
            password: hash,
        });

        // создаем пользователя в MongoDB
        const user = await newUser.save();
        
        // создаем токен - генирируем его
        const token = jwt.sign(
            // шифруем id
            // { id: user._id },
            { id: user._id, roles: user.roles},
            
            // ключ шифрования
            process.env.JWT,
            // жизнь-срок токена
            { expiresIn: "30d" }
        );

        // ответ об успехе
        response.json({
            token,
            user,
            message: "Регистрация прошла успешно!"
        })

    } catch(error) {
        response.json({ 
            message: "Ошибка при создании пользователя."
        });     
    }
};

// логин
export const login = async (request, response) => {
    try {
        // получаем полученный email и password
        const { login, password }= request.body;

        // находим пользователя по email
        const user = await UserModel.findOne({ login });
        // если нету user, то...
        if (!user) {
            // возвращаем ошибку
            return response.json({
                message: "Неверный 'Login'."
            });
        }

        // проверяем и сравниваем пароли 
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // если не сходится, то...
        if(!isPasswordCorrect) {
            // возвращаем ошибку
            return response.json({
                message: "Неверный 'Password'."
            });
        }

        // создаем токен - генирируем его
        const token = jwt.sign(
            // шифруем id
            // { id: user._id }, 
            { id: user._id, roles: user.roles},
            // ключ шифрования
            process.env.JWT,
            // жизнь-срок токена
            { expiresIn: "30d" }
        );

        // ответ об успехе
        response.json({
            token,
            user,
            message: "Вход выполнен успешно!"
        });
    }catch (error) {
        response.json({ 
            message: "Ошибка при авторизации."
        });     
    }
};

// логика, которая запоминает пользователя
export const getMe = async (request, response) => {
    try{
        // находим user по Id, котрый мы вшили в фун. checkAuth
        const user = await UserModel.findById(request.userId);
        // если нету user, то...
        if(!user){
            // возвращаем ошибку
            return response.json({
                message: "Пользователь не найден."
            });
        }
        // создаем токен - генирируем его
        const token = jwt.sign(
            // шифруем id
            // { id: user._id }, 
            { id: user._id, roles: user.roles},
            // ключ шифрования
            process.env.JWT,
            // жизнь-срок токена
            { expiresIn: "30d" }
        );
        // ответ об успехе
        response.json({
            token,
            user,
            message: "Ваш профиль.",
        });
    } catch (error) {
        response.json({ 
            message: "Heт доступа."
        });     
    }
};

// профиль
export const getProfile = async(request, response) => {
    try {
        // находим пользователя по id
        const userId = request.params.id;
        const user = await UserModel
            .findById(userId)
            .sort('-createdAt')
            .populate({ 
                path: "posts",
                select: ["title"] 
            });
        // проверка
        if (!user) {
            return response.status(404).json({
                message: 'Профиль не найден.' 
            });
        }
        // ответ об успехе
        response.json(user);
    } catch(error) {
        console.log(error);
        response.status(500).json({ 
            message: 'He удалось получить профиль.'
        });     
    }
}