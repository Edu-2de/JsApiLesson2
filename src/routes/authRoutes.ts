import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// -------- need login account or owner/admin access -----------
router.get('/profile', AuthMiddleware.authenticateToken ,AuthController.getUser);

// -------- need admin access -----------
router.get('/admin/:userId', AuthMiddleware.requireAdmin, AuthController.getUserById);


export default router;
