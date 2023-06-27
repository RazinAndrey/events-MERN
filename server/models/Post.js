// подключаем библиотеку 'mongoose' для работы с моделью
import mongoose from "mongoose";

// таблица Posts
const PostSchema = new mongoose.Schema(
    {
        // пользователь
        fullName: { type: String },
        // заголовок
        title: { type: String, required: true },
        // текст
        text: { type: String, required: true },
        // url
        addressUrl: { type: String, default: "" },
        // картинка
        imgUrl: { type: String, default: "" },
        // просмотры
        viewsCount: { type: Number, default: 0 },
        // тип
        type : { type: String, default: "Вузовская" },
        // автор
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        // коментарии
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        // дата окончания
        dateEnd: { type: Date, default: Date.now }
    },
    // дата => создания и обновления
    { timestamps: true }
);

// называем нашу PostSchema, как Post и делаем export
export default mongoose.model("Post", PostSchema);