import { Router } from 'express';
import { TransactionsController } from '../controllers/transactionsController';
import { AccountMiddleware } from '../middleware/accountMiddleware';

const router = Router();

router.post('/withdrawal', AccountMiddleware.authenticateToken, TransactionsController.withdrawal);
router.post('/deposit', AccountMiddleware.authenticateToken, TransactionsController.deposit);
router.post('/transfer', AccountMiddleware.authenticateToken, TransactionsController.transfer);

router.get('/', AccountMiddleware.authenticateToken, TransactionsController.getTransactions);

router.get('/admin', AccountMiddleware.requireAdmin, TransactionsController.getAllTransactions);

export default router;
