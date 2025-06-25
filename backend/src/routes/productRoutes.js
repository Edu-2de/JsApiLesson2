import { Router } from 'express';
import upload from "../middlewares/uploadImage.js"; 
import { registerProduct, getAllProducts, searchProducts, getProductsByCategory, getProductById, updateProduct, deleteProduct, buyProduct} from '../controllers/productController.js';
import requireAdmin from "../middlewares/adminMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/register",
  requireAdmin,
  upload.single("image"), // 'image' é o nome do campo do formulário
  registerProduct
);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);
router.post('/:id',authMiddleware, buyProduct);


export default router;