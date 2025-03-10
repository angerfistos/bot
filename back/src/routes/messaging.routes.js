const express = require("express");
const {
  getMessagingStatus,
  sendMessage,
  getMessages,
  getChats,
} = require("../messaging");

const router = express.Router();

// 📌 Récupérer le statut de la connexion WhatsApp
router.get("/status", getMessagingStatus);

// 📌 Récupérer les messages d'une conversation spécifique
router.get("/messages/:chatId", getMessages);

// 📌 Récupérer la liste des conversations
router.get("/conversations", getChats);

// 📌 Envoyer un message via WhatsApp
router.post("/send-message", sendMessage);

module.exports = router;
