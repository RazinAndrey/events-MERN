import { Router } from 'express';
import checkAuth from '../utils/checkAuth.js';
import { createComment, removeComment, getCommentById } from '../controllers/CommentController.js';

// создаем router
const router = new Router();

router.post('/comments/:id', checkAuth, createComment);

router.delete('/comments/:id', checkAuth, removeComment);

// router.get('/comments/:id', getCommentById);

export default router;