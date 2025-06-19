import { Router } from "express";
import requireAdmin from "../middlewares/adminMiddleware.js";
const router = Router();

router.get("/Admin", requireAdmin, (req, res) => {
  res.json({ message: "Bem-vindo, admin!" });
});

export default router;