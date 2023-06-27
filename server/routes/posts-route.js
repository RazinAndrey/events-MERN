// подключаем функцию Router для маршрутизации
import { Router } from 'express';

// подключаем нашу валидацию для проверки заполнения постов    
import { postValidation } from '../validations/post-validator.js';

// подключаем наши сontrollers
import * as PostController from '../controllers/PostController.js';

// подключаем наши функции промежуточной обработки (middleware) - checkAuth, handleValidationErrors
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/checkRole.js';
import handleValidationErrors from '../utils/validationErrors.js'; 

// создаем router
const router = new Router();

// получение всех статей
router.get('/posts', PostController.getAll);

// получение одной статьи
router.get('/posts/:id', PostController.getById);

// получение моих статей
router.get('/my-posts', checkAuth, PostController.getMyPosts);

// роли - 'STUDENT','TEACHER'
// создание статьи (могут только авторизованные прользователи)
// router.post('/posts', checkAuth, checkRole(['STUDENT','TEACHER']), postValidation, handleValidationErrors, PostController.create);
router.post('/posts', checkAuth, checkRole(['TEACHER']), postValidation, handleValidationErrors, PostController.create);

// обновление статьи (могут только авторизованные прользователи)
router.put('/posts/:id', checkAuth, checkRole(['TEACHER']), postValidation, handleValidationErrors, PostController.update);

// удаление статьи (могут только авторизованные прользователи)
router.delete('/posts/:id', checkRole(['TEACHER']), checkAuth, PostController.remove);

// получаем все коментарии у определенного поста
router.get('/post/comments/:id', PostController.getPostComments);

export default router;