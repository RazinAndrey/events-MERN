// подключаем функции для работы с authSlice
// и библиотеку axios с нашими настройками для связи с backend
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/api';

// хранилище-состояние
let initialState = {
    token: null, 
    user: null,    
    status: null, // сообщение
    isLoading: false, // загрузка
};

// запрос async register
export const registerUser = createAsyncThunk(
    'auth/registerUser', 
    async(params) => { // params - имя, пароль и т.д.
        try{
            // вытаскиваем данные из запроса
            const { data } = await axios.post('/auth/register', params);
            // сохраняем токен
            if(data.token) {
                window.localStorage.setItem('token', data.token);
            }
            // возвращаем данные из backend
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

// запрос async login
export const loginUser = createAsyncThunk(
    'auth/loginUser', 
    async(params) => {
        try{
            // вытаскиваем данные из запроса
            const { data } = await axios.post('/auth/login', params);
            // сохраняем токен
            if(data.token) {
                window.localStorage.setItem('token', data.token);
            }
            // возвращаем данные из backend
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

// запрос async me - проверка авторизации
export const getMe = createAsyncThunk(
    'auth/getMe', 
    async() => {
        try{
            // вытаскиваем данные из запроса
            const { data } = await axios.get('/auth/me');
            // возвращаем данные
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

// создаем slice
const authSlice = createSlice({
    // название
    name: 'auth',
    // хранилище
    initialState,
    // методы, которы будут обновлять state 
    reducers: {
        // функция выхода
        logout: (state) => {
            state.user = null
            state.token = null
            state.status = null
            state.isLoading = false
        }
    },
    // управление состоянием
    extraReducers: (builder) => {
        // Register
        // запрос отправляется => 'loading'
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.status = null;
        });
        // пришли данные в state => 'loaded' => запрос выполнился
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            // данные из бэка
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.status = action.payload.message;
        });
        // ошибка => 'error'
        builder.addCase(registerUser.rejected, (state, action) => {
            state.status = action.payload.message;
            state.isLoading = false;
        });

        // Login
        // запрос пошёл => 'loading'
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.status = null;
        });
        // пришли данные в state => 'loaded' => запрос выполнился
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            // данные из бэка
            state.status = action.payload.message;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        // ошибка => 'error'
        builder.addCase(loginUser.rejected, (state, action) => {
            state.status = action.payload.message;
            state.isLoading = false;
        });

        // Проверка авторизации
        // запрос пошёл => 'loading'
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
            state.status = null;
        });
        // пришли данные в state => 'loaded' => запрос выполнился
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            // данные из бэка
            state.status = null;
            // проверяем есть ли user и его token
            state.user = action.payload?.user;
            state.token = action.payload?.token;
        });
        // ошибка => 'error'
        builder.addCase(getMe.rejected, (state, action) => {
            state.status = action.payload.message;
            state.isLoading = false;
        });
    } 
});

// проверка на авторизацию 
export const checkIsAuth = (state) => Boolean(state.auth.token);

// проверка роли
// export const checkIsRole = (state) => Boolean(state.auth.user.role);

// функция выхода
export const {logout} = authSlice.actions;

// slice/reducer
export const authReducer = authSlice.reducer;