// подключаем библиотеку 'express' для работы с web-сервером
import express from 'express';

// подключаем библиотеку 'mongoose' для работы с mongoDB
import mongoose from 'mongoose';

// подключаем библиотеку 'dotenv' для скрытия деталей
import dotenv from 'dotenv';

// подключаем библиотеку 'cors' вызова нашего backend через другой порт
import cors from 'cors';

// для работы с файлами
import fileUpload from 'express-fileupload';

// подключаем маршруты
import authRoute from './routes/auth-route.js';
import postsRoute from './routes/posts-route.js';
import commentsRoute from './routes/comments-route.js';
import usersRoute from './routes/users-route.js';

// включаем dotenv
dotenv.config();

// constants
const PORT = process.env.PORT;
const DB = process.env.DB;

// создаем web-приложение 'express'
const app = express();

/* настройки Express - Middlewares */
// указываем приложению, что можно подключаться к backend через другой порт 
// это строка позволит подключаться UI к нашему server
app.use(cors());
// указываем приложению, что нужно использовать json
// это строка позволяет читать json, который будет приходить в наших запросах 
app.use(express.json());
// указываем приложению, что мы можем использовать files
app.use(fileUpload());
// указываем приложению, где хранить наши files
app.use(express.static('uploads'));

// маршруты
app.use('/api/auth', authRoute);
app.use('/api', postsRoute);
app.use('/api', commentsRoute);
app.use('/api', usersRoute);

// запуск сервера и async подключаемся к БД
const start = async () => { 
    try {
        // подключаемся к базе mongoDB
        await mongoose
            .connect(DB)
            .then(() => console.log('DataBase OK'))
            .catch((error) => console.log('DataBase Error', error));
        // запуск web-сервера
        app.listen(PORT, (error) => {
            if(error){
                return console.log(error);
            }
            console.log('Server OK');
        });
    } catch (error){
        console.log(error)
    }
}
start();

// тест