const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getBotQrCode } = require("../controllers/bot.controller");

// 📌 Récupérer le QR Code du bot
router.get("/qr", authMiddleware, getBotQrCode);

module.exports = router;
