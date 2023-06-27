import CommentModel from "../models/Comment.js";
import PostModel from '../models/Post.js';

export const createComment = async (req, res) => {
    try {
        // получаем данные
        const { postId, comment } = req.body;

        // проверка
        if (!comment) {
            return res.json({ 
                message: 'Комментарий не может быть пустым.' 
            });
        }
        // создаём коментарий
        const newComment = new CommentModel({
            comment,
            author: req.userId
        });
        // сохраняем коментарий в БД
        await newComment.save();
        try {
            // добавляем коментарий к статье
            await PostModel.findByIdAndUpdate(postId, {
                $push: { comments: newComment }
            });
        } catch (error) {
            console.log(error);
        }
        // // вытаскиваем динамический параметр id у нашего запроса '/posts/:id'
        // // const postId = req.params.id;
        // // получаем и обновляем статью, а именно счетчик просмотров
        // await PostModel.updateMany (
        //     // 1 параметр // Как находим? // Находим по параметру Id
        //     { _id: postId },
        //     // 2 параметр // Что сделать? //  viewsCount на 1
        //     { $inc: { viewsCount: -1 } },
        // );
        // ответ об успехе
        res.json(newComment);
    } catch (error) {
        res.json({ message: 'Невозможно создать коментарий.' });
    }
}

export const removeComment = async (req, res) => {
    try {
        // вытаскиваем динамические параметры id у запроса 
        const commentId = req.params.id;
        // получаем и удаляем коммент по ID
        const comment = await CommentModel.findByIdAndDelete(commentId);
        // проверка
        if (!comment) {
            return res.status(404).json({
                message: 'He удалось удалить комментарий.'
            });
        }
        // находим пользователя по ID в теле запроса
        const { postId } = req.body;
        await PostModel.updateMany(postId, {
            $pull: { comments: { $in: commentId } }
        });

        // ответ
        res.json({
            message: 'Комментарий был удалён.'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Конментарий не найден.'
        });
    }
}

export const getCommentById = async (req, res) => {
    try {
        // вытаскиваем динамический параметр id у нашего запроса '/posts/:id'
        const commentId = req.params.id;
        // получаем и обновляем статью, а именно счетчик просмотров
        const comment = await CommentModel.findByIdAndUpdate(commentId);
        // проверка
        if (comment) {
            return res.status(404).json({ message: 'Комментарий не найдена' });
        }
        // ответ
        res.json(comment);
    } catch(err) {
        console.log(err) ;
        res.status(500).json({ 
            message: 'He удалось получить комментарий'
        });     
    }
}