import { Router } from 'express';
import { CardController } from '../controllers/cardController';
import { AccountMiddleware } from '../middleware/accountMiddleware';

const router = Router();

router.post('/', AccountMiddleware.authenticateToken, CardController.createCard);

router.delete('/', AccountMiddleware.authenticateToken, CardController.deleteCard);

router.get('/', AccountMiddleware.authenticateToken, CardController.getCards)
export default router;
