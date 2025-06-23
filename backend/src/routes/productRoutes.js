import { Router } from 'express';
import { registerProduct, getAllProducts, searchProducts, getProductsByCategory, getProductById, updateProduct} from '../controllers/productController.js';
// 

const router = Router();

router.post('/register', registerProduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);

export default router;