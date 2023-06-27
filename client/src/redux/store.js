// подключаем функцию для нашего хранилища
import { configureStore} from '@reduxjs/toolkit'
import { postsReducer } from './slices/posts-slice';
import { authReducer } from './slices/auth-slice';
import { commentsReducer } from './slices/comments-slice';

// хранилище redux
const store = configureStore({
    reducer: {
        posts: postsReducer,
        comments: commentsReducer,
        auth: authReducer
    }
});

export default store;

