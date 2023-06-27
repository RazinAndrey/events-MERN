// подключаем библиотеку 'multer' для работы с файлами
import multer from 'multer';

// создаём хранилище, где будем сохранять наши картинки
const storage = multer.diskStorage({
    // путь куда загружаем изображения
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    // имя того, как будет называться наш файл
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

/* указываем функцию промежуточной обработки (middleware) - upload
эта строка позволит нам использовать наше хранилище для наших картинок */
export const upload = multer({ storage });