import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { AccountMiddleware } from '../middleware/accountMiddleware';

const router = Router();

router.post('/login', AccountController.loginAccount);
router.post('/register', AccountController.registerAccount);

router.get('/myaccount', AccountMiddleware.authenticateToken, AccountController.getAccount);
router.patch('/myaccount', AccountMiddleware.requireAdminOrOwner, AccountController.updateAccount);
router.delete('/myaccount', AccountMiddleware.requireAdminOrOwner, AccountController.deleteAccount);

router.get('/admin/:accountId', AccountMiddleware.requireAdmin, AccountController.getAccountById);
router.patch('/admin/:accountId', AccountMiddleware.requireAdmin, AccountController.updateAccountById);
router.delete('/admin/:accountId', AccountMiddleware.requireAdmin, AccountController.deleteAccountById);
router.get('admin/all', AccountMiddleware.requireAdmin, AccountController.getAllAccounts);

export default router;
