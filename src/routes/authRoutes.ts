import { Router } from 'express';
import { AuthController } from '../controllers/authController';


const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

router.get('/profile', AuthController.getUser);
router.get('/admin/:userId', AuthController.getUser);

export default router;
