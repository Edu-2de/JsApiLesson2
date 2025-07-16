import { Router } from 'express';
import { CardController } from '../controllers/cardController';
import { AccountMiddleware } from '../middleware/accountMiddleware';

const router = Router();

router.post('/', AccountMiddleware.authenticateToken, CardController.createCard);

router.delete('/', AccountMiddleware.authenticateToken, CardController.deleteCard);

export default router;
