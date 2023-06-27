// подключаем библиотеку 'mongoose' для работы с моделью
import mongoose from "mongoose";

// таблица Posts
const CommentSchema = new mongoose.Schema(
    {
        // комментарий
        comment: { type: String, required: true },
        // автор
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    // дата => создания и обновления
    { timestamps: true }
);

// называем нашу CommentSchema, как Comment и делаем export
export default mongoose.model("Comment", CommentSchema);