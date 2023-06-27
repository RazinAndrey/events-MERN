// подключаем библиотеку 'mongoose' для работы с моделью
import mongoose from "mongoose";

// таблица Roles
const RoleSchema = new mongoose.Schema(
    {
        // роль
        roleName: { type: String, unique: true,  default: "STUDENT" },
    },
    // дата => создания и обновления
    { timestamps: true }
);

// называем нашу RoleSchema, какRole и делаем export
export default mongoose.model("Role", RoleSchema);