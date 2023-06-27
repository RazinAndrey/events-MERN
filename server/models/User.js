// подключаем библиотеку 'mongoose' для работы с моделью
import mongoose from "mongoose";

// создаем таблицу Users
const UserSchema = new mongoose.Schema(
    {
        fullName: { 
            type: String,
            required: true
        },
        login: {
            type: String,
            required: true,
            unique: true 
        },
        email: {
            type: String,
            required: true, 
            unique: true 
        },
        password: {
            type: String,
            required: true 
        },
        // пocты
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
        // роль
        // role : { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, 
        roles: [{type: String, ref: 'Role'}]
    }, 
    // дата => создания и обновления
    { timestamps: true }
);

// называем нашу UserSchema, как User и делаем export
export default mongoose.model('User', UserSchema);