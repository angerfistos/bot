const express = require("express");
const router = express.Router();
const {
  getMessagingStatus,
  sendMessage,
  getMessages,
  getChats,
  getContact,
  resetSession,
} = require("../controllers/messaging.controller"); // ✅ Chemin correct


// 📌 Route pour récupérer le statut de connexion WhatsApp
router.get("/status", getMessagingStatus);

// 📌 Route pour envoyer un message
router.post("/send-message", sendMessage);

// 📌 Route pour récupérer les messages d'une conversation spécifique
router.get("/messages/:chatId", getMessages);

// 📌 Route pour récupérer la liste des conversations
router.get("/chats", getChats);

// 📌 Route pour récupérer les infos d'un contact (💡 Nouvelle route)
router.get("/contact/:chatId", getContact);

// 📌 Route pour réinitialiser la session WhatsApp
router.post("/reset-session", resetSession);

module.exports = router;
