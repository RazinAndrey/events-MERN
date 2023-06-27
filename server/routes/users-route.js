import { Router } from 'express';
// import checkAuth from '../utils/checkAuth.js';
import { getProfile } from '../controllers/UserController.js';

// создаем router
const router = new Router();

router.get('/user/:id', getProfile);

export default router;