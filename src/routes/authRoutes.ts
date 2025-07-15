import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// -------- need login account or owner/admin access -----------
router.get('/', AuthMiddleware.authenticateToken, AuthController.getUser);

router.patch('/', AuthMiddleware.authenticateToken, AuthController.updateUser);

router.delete('/', AuthMiddleware.authenticateToken, AuthController.deleteUser);

// -------- need admin access -----------
router.get('/admin/:userId', AuthMiddleware.requireAdmin, AuthController.getUserById);

router.patch('/admin/:userId', AuthMiddleware.requireAdmin, AuthController.updateUserById);

router.delete('/admin/:userId', AuthMiddleware.requireAdmin, AuthController.deleteUserById);

export default router;
