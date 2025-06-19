import { Router } from "express";
import requireAdmin from "../middlewares/adminMiddleware.js";
const router = Router();

router.get("/admin", requireAdmin, (req, res) => {
  res.json({ message: "Bem-vindo, admin!" });
});

export default router;