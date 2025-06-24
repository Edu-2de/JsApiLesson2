import { Router } from 'express';
import { registerProduct, getAllProducts, searchProducts, getProductsByCategory, getProductById, updateProduct, deleteProduct} from '../controllers/productController.js';

const router = Router();

router.post('/register', registerProduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.put('/edit/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);


export default router;