import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { AccountMiddleware } from '../middleware/accountMiddleware';

const router = Router();

router.post('/login', AccountController.loginAccount);
router.post('/register', AccountController.registerAccount);

// -------- need login account or owner/admin access -----------
router.get('/myaccount', AccountMiddleware.authenticateToken, AccountController.getAccount);

router.delete('/myaccount', AccountMiddleware.requireAdminOrOwner, AccountController.deleteAccount);
router.patch('/myaccount/close', AccountMiddleware.requireAdminOrOwner, AccountController.closeAccount);
router.patch('/myaccount/active', AccountMiddleware.requireAdminOrOwner, AccountController.activeAccount);

// -------- need admin access -----------
router.delete('/admin/:accountId', AccountMiddleware.requireAdmin, AccountController.deleteAccountById);

router.patch('/admin/:accountId', AccountMiddleware.requireAdmin, AccountController.updateAccountById);
router.patch('/admin/block/:accountId', AccountMiddleware.requireAdmin, AccountController.blockAccountId);
router.patch('/admin/close/:accountId', AccountMiddleware.requireAdmin, AccountController.closeAccountId);
router.patch('/admin/active/:accountId', AccountMiddleware.requireAdmin, AccountController.activeAccountId);

router.get('/admin/:accountId', AccountMiddleware.requireAdmin, AccountController.getAccountById);
router.get('/admin/all', AccountMiddleware.requireAdmin, AccountController.getAllAccounts);

export default router;
