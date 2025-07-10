import { Router } from "express";
import { AccountController } from "../controllers/accountController";
import { AccountMiddleware } from "../middleware/accountMiddleware";

const router = Router();

router.post("/login", AccountController.loginAccount);
router.post("/register", AccountController.registerAccount);

router.get('/myaccount', AccountMiddleware.authenticateToken,  AccountController.getAccount);

router.patch('/:accountId', AccountMiddleware.authenticateToken, AccountMiddleware.requireAdminOrOwner, AccountController.updateAccountById);

export default router;
