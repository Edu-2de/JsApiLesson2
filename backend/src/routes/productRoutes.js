import { Router } from 'express';
import { registerProduct} from '../controllers/productController.js';

const router = Router();

router.post('/register', registerProduct);

export default router;