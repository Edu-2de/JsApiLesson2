import { Router } from 'express';
import { registerProduct, getAllProducts, searchProducts, getProductsByCategory} from '../controllers/productController.js';
// 

const router = Router();

router.post('/register', registerProduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);

export default router;