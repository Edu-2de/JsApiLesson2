import { Router } from 'express';
import { registerProduct, getAllProducts, searchProducts, getProductsByCategory, getProductById, updateProduct, deleteProduct} from '../controllers/productController.js';
import requireAdmin from "../middlewares/adminMiddleware.js";

const router = Router();

router.post('/register', requireAdmin, registerProduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);


export default router;