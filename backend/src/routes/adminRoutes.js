const express = require("express");
const requireAdmin = require("../middleware/adminMiddleware");
const router = express.Router();

router.get("/admin", requireAdmin, (req, res) => {
  res.json({ message: "Bem-vindo, admin!" });
});

module.exports = router;