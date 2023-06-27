import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/api';

// запрос async на получение всех статей
export const getAllPosts = createAsyncThunk('posts/getAllPosts', async() => {
    try{
        // вытаскиваем данные из запроса
        const { data } = await axios.get('/posts');
        // возвращаем данные из backend
        return data;
    } catch(error) {
        console.log(error);
    }
});

// запрос async на создание статьи
export const createPost = createAsyncThunk('posts/createPost', async(params) => {
    try {
        const { data } = await axios.post('/posts', params);
        return data;
    } catch(error) {
        console.log(error);
    }
});

// Удаление статьи
export const removePost = createAsyncThunk('posts/removePost', async(id) => {
    try{
        const { data } = await axios.delete(`/posts/${id}`, id);
        return data;
    } catch (error) {
        console.log(error);
    }
});

// обновление статьи
export const updatePost = createAsyncThunk('posts/updatePost', async(updatedPost) => {
    try{
        const { data } = await axios.put(`/posts/${updatedPost.id}`, updatedPost);
        return data;
    } catch (error) {
        console.log(error);
    }
});

// хранилище
let initialState = {
    posts: [],
    loading: false
}

// создаем slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    // методы, которы будут обновлять state 
    reducers: {},
    // состояние нашего асинхронного action
    extraReducers: builder => {
        // Создание мероприятия
        // запрос пошёл => 'loading'
        builder.addCase(createPost.pending, (state) => {
            state.loading = true;
        });
        // пришли данные в state => 'loaded'
        builder.addCase(createPost.fulfilled, (state, action) => {
            state.loading = false;
            // state.posts = [];
            state.posts.push(action.payload);
        });
        // ошибка => 'error'
        builder.addCase(createPost.rejected, (state) => {
            state.loading = false;
        });
        // Получение всех постов
        // запрос пошёл => 'loading'
        builder.addCase(getAllPosts.pending, (state) => {
            state.posts = [];
            state.loading = true;
        });
        // пришли данные в state => 'loaded'
        builder.addCase(getAllPosts.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        });
        // ошибка => 'error'
        builder.addCase(getAllPosts.rejected, (state) => {
            state.posts = [];
            state.loading = false;
        });
        // Удаление статьи
        // запрос пошёл => 'loading'
        builder.addCase(removePost.pending, (state) => {
            state.posts = [];
            state.loading = true;
        });
        // пришли данные в state => 'loaded'
        builder.addCase(removePost.fulfilled, (state, action) => {
            // пушим массив без удаленной статьи
            state.posts = state.posts.filter(
                (post) => post._id !== action.payload.id
            );
            state.loading = false;
        });
        // ошибка => 'error'
        builder.addCase(removePost.rejected, (state) => {
            state.posts = [];
            state.loading = false;
        });
        // Обновление поста
        // запрос пошёл => 'loading'
        builder.addCase(updatePost.pending, (state) => {
            state.posts = [];
            state.loading = true;
        });
        // пришли данные в state => 'loaded'
        builder.addCase(updatePost.fulfilled, (state, action) => {
            // находим пост по id, который мы изменили
            const index = state.posts.findIndex(
                (post)=> post._id === action.payload._id);
            // меняем пост на обнавленный
            state.posts[index] = action.payload; 
            state.loading = false;
        });
        // ошибка => 'error'
        builder.addCase(updatePost.rejected, (state) => {
            state.posts = [];
            state.loading = false;
        });
    } 
});


// slice/reducer
export const postsReducer = postsSlice.reducer;

