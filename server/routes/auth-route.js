// подключаем функцию Router для маршрутизации
import { Router } from 'express';

// подключаем UserController
import * as UserController from '../controllers/UserController.js';

// подключаем валидацию
import { registerValidation, loginValidation } from '../validations/auth-validator.js';

// подключаем middleware
import checkAuth from '../utils/checkAuth.js'; 
import handleValidationErrors from '../utils/validationErrors.js';


// создаем router
const router = new Router();

// регистрация
router.post('/register', registerValidation, handleValidationErrors, UserController.register);

// логин
router.post('/login', loginValidation, handleValidationErrors, UserController.login);

// этот роут всегда обновялется при обновлении страницы
// т.е. если мы обновили страницу, то мы все равно остаемся в системе
router.get('/me', checkAuth, UserController.getMe);

// профиль
// router.get('/profile/:id', checkAuth, UserController.profile);
// router.get('/profile', checkAuth, UserController.profile);

// export
export default router;



