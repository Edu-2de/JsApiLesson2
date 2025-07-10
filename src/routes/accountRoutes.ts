import { Router } from "express";
import { AccountController } from "../controllers/accountController";

const router = Router();

router.post('/login', AccountController.loginAccount)

router.post('/register', AccountController.registerAccount)