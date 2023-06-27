import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from './../../api/api';

// создание комментария
export const createComment = createAsyncThunk('comments/createComment', async({postId, comment}) => {
    try {
        const { data } = await axios.post(`/comments/${postId}`, {
            postId, comment
        });
        return data;
    } catch (error) {
        console.log(error);
    }
});

// поучение комментариев
export const getPostComments = createAsyncThunk('comments/getPostComments', async(postId) => {
    try {
        const { data } = await axios.get(`/post/comments/${postId}`);
        return data;
    } catch (error) {
        console.log(error);
    }
});

// удаления комментария
export const removeComment = createAsyncThunk('comments/removeComment', async(id) => {
    try{
        const { data } = await axios.delete(`/comments/${id}`, {id});
        return data;
    } catch (error) {
        console.log(error);
    }
});

// slice комментариев
export const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        loading: false,
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Создание комментария
        // запрос пошёл => 'loading'
        builder.addCase(createComment.pending, (state) => {
            state.loading = true;
        });
        // пришли данные в state => 'loaded'
        builder.addCase(createComment.fulfilled, (state, action) => {
            state.loading = false;
            // state.comments.push(action.payload);
            state.comments.push(action.payload);
        });
        // ошибка => 'error'
        builder.addCase(createComment.rejected, (state) => {
            state.loading = false;
            console.log("Ошибка");
        });

        // Получение коментариев
        // запрос пошёл => 'loading'
        builder.addCase(getPostComments.pending, (state) => {
            state.loading = true;
        });
        // пришли данные в state => 'loaded'
        builder.addCase(getPostComments.fulfilled, (state, action) => {
            state.loading = false;
            state.comments = action.payload;
        });
        // ошибка => 'error'
        builder.addCase(getPostComments.rejected, (state) => {
            state.loading = false;
            console.log("Ошибка");
        });

        // Удаление 
        builder.addCase(removeComment.pending, (state, action) => {
            state.comments = state.comments.filter(
                (comment) => comment._id !== action.meta.arg
            );
        });
    }
});

export const {setCurrentPage} = commentsSlice.actions;

export const commentsReducer = commentsSlice.reducer;

