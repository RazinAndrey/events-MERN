import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import CommentModel from '../models/Comment.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const getAll = async (req, res) => {
    try {
        // получаем все статьи
        // передаем связь между таблицами users и posts 
        // выбираем нужную информацию о пользователе
        const posts = await PostModel.find().sort('-createdAt').populate({ path: "author", select: ["fullName"] }).exec();

        // популярные посты
        // const popularPosts = await PostModel.find().limit(5).sort('-views');

        if(!posts) {
            return res.json({message: "Мероприятий нет."});
        }

        // возвращаем ответ
        res.json(posts); //popularPosts
    } catch(err) {
        console.log(err) ;
        res.status(500).json({ 
            message: 'He удалось получить статьи.'
        });     
    }
}

export const getById = async (req, res) => {
    try {
        // вытаскиваем динамический параметр id у нашего запроса '/posts/:id'
        const postId = req.params.id;
        // получаем и обновляем статью, а именно счетчик просмотров
        const post = await PostModel.findByIdAndUpdate (
            // 1 параметр // Как находим? // Находим по параметру Id
            { _id: postId },
            // 2 параметр // Что сделать? // Увеличить viewsCount на 1
            { $inc: { viewsCount: 1 } },
            // 3 параметр // Обясняем, что обновляем статью и возвращаем обновленный результат
            { new: true }
        ).populate({ path: "author", select: ["fullName"] });
        // проверка
        if (!post) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }
        // ответ
        res.json(post);
    } catch(err) {
        console.log(err) ;
        res.status(500).json({ 
            message: 'He удалось получить статью'
        });     
    }
}

export const remove = async (req, res) => {
    try {
        // вытаскиваем динамический параметр id у нашего запроса '/posts/:id'
        const postId = req.params.id;
        // получаем и удаляем статью по ID
        const posts = await PostModel.findByIdAndDelete(postId);
        // проверка
        if (!posts) {
            return res.status(404).json({
                message: 'He удалось удалить статью.' 
            });
        }
        // находим пользователя по ID в параметрах статьи
        await UserModel.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id }
        });

        
        // загружаем все комментарии у поста и удаляем их
        await Promise.all(
            posts.comments.map((comment) => {
                return CommentModel.deleteMany(comment).populate({ path: "author", select: ["fullName"] });
            })
        )

        // ответ
        res.json({
            message: 'Статья была удалена.'
        });
    } catch(err) {
        console.log(err) ;
        res.status(500).json({ 
            message: 'Статья не найдена.'
        });     
    }
}

// создание статьи
export const create = async (req, res) => {
    try {
        // получаем пользователя по id (авт или нет)
        const user = await UserModel.findById(req.userId);

        // прешёл файл в запросе
        if(req.files) {
            // имя file
            let fileName = req.files.image.name;
            // доступ к папке
            const __dirname = dirname(fileURLToPath(import.meta.url));

            if(!fs.existsSync('uploads')){
                fs.mkdirSync('uploads');
            }
            // перемещаем file в папку 
            req.files.image.mv(path.join(__dirname, "..", 'uploads', fileName));
            

            // создаём экземпляр объекта пост с file
            const newPostWithImage = new PostModel({
                fullName: user.fullName, 
                title: req.body.title,
                text: req.body.text,
                addressUrl: req.body.addressUrl,
                type: req.body.type,
                imgUrl: fileName,
                dateEnd: req.body.dateEnd,
                author: req.userId
            });

            // создаем статью с file
            await newPostWithImage.save();
            // находим user и обнавлем его статьи
            await UserModel.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage }
            });

            // ответ об успехе
            res.json(newPostWithImage);
        } else {
            // подготавливаем экземпляр объекта на создание статьи без file
            const newPostWithoutImage = new PostModel({
                fullName: user.fullName, 
                title: req.body.title,
                text: req.body.text,
                addressUrl: req.body.addressUrl,
                type: req.body.type,
                imgUrl: '',
                dateEnd: req.body.dateEnd,
                author: req.userId
            });

            // создаем пост
            await newPostWithoutImage.save();

            // находим user и обнавлем его статьи
            await UserModel.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithoutImage }
            });

            // ответ об успехе
            res.json(newPostWithoutImage);
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "He удалось создать статью." });     
    }
}


export const update = async(req, res) => {
    try{
        // получаем полученные данные
        const { id, title, text, addressUrl, type, dateEnd } =  req.body;
        // находим статью по id
        const post = await PostModel.findById(id);
        // если прешёл файл в запросе, то...
        if(req.files) {
            /* добавляем file*/
            // имя file
            let fileName = req.files.image.name;
            // доступ к папке
            const __dirname = dirname(fileURLToPath(import.meta.url));
            // перемещаем file в папку 
            req.files.image.mv(path.join(__dirname, "..", 'uploads', fileName));
            /* изменяем file*/
            // если мы меняем фаил, то...
            post.imgUrl = fileName || '';
        }
        // обновляем статью
        post.title = title;
        post.text = text;
        post.addressUrl = addressUrl;
        post.type = type;
        post.dateEnd = dateEnd;
        // сохраняем статью
        await post.save()
        // ответ - возращаем обновленный пост
        res.json(post);
    } catch (err){
        console.log(err) ;
        res.status(500).json({ 
            message: 'He удалось обновить статью.'
        });     
    }
}

// получение моих постов
export const getMyPosts = async(req, res) => {
    try{
        // находим пользователя
        const user = await UserModel.findById(req.userId);
        // находим всю ину о постах пользователя
        const list = await Promise.all(
            user.posts.map((post) => {
                return PostModel.findById(post._id);
            })
        );
        res.json(list);
    }
    catch (error) {
        console.log(error);
        res.json({ message: "He получилось получить ваши статьи." });
    }
}

export const getPostComments = async(req, res) => {
    try {
        // получаем пост по id
        const post = await PostModel.findById(req.params.id);
        // загружаем все комментарии у поста
        const list = await Promise.all(
            post?.comments?.map((comment) => {
                return CommentModel.findById(comment).populate({ path: "author", select: ["fullName"] });
            })
        )
        // ответ об успехе
        res.json(list);
    } catch (error) {
        console.log(error);
        res.json({ message: "He получилось получить коментарии." });
    }
}