const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

let io; // Variable pour gérer WebSocket

const MessageSchema = new mongoose.Schema({
  chatId: String,
  from: String,
  body: String,
  timestamp: Number,
});

const Message = mongoose.model("Message", MessageSchema);

const messagingClient = new Client({
  authStrategy: new LocalAuth({ clientId: "messaging" }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

let messagingStatus = "En attente du QR Code";
let messagingQrCode = null;

/* -------------------------------------------------------------------------- */
/*                         🔄 Gestion du QR Code                              */
/* -------------------------------------------------------------------------- */
messagingClient.on("qr", async (qr) => {
  console.log("📸 QR Code généré !");
  messagingStatus = "QR Code prêt, scannez pour connecter WhatsApp Web";
  messagingQrCode = await qrcode.toDataURL(qr);
});

/* -------------------------------------------------------------------------- */
/*                          ✅ Connexion réussie                              */
/* -------------------------------------------------------------------------- */
messagingClient.on("ready", async () => {
  console.log("✅ Messagerie WhatsApp Web connectée !");
  messagingStatus = "Messagerie connectée ✅";
  messagingQrCode = null;
});

/* -------------------------------------------------------------------------- */
/*                          📩 Gestion des Messages                           */
/* -------------------------------------------------------------------------- */
messagingClient.on("message", async (msg) => {
  console.log(`📩 Message reçu de ${msg.from}: ${msg.body}`);

  const newMessage = await Message.create({
    chatId: msg.from,
    from: msg.from,
    body: msg.body,
    timestamp: Date.now(),
  });

  if (io) {
    io.emit("newMessage", newMessage);
  }
});

/* -------------------------------------------------------------------------- */
/*                        🛠️ Fonctions API REST                              */
/* -------------------------------------------------------------------------- */

// 📌 Récupérer le statut de connexion WhatsApp
const getMessagingStatus = (req, res) => {
  console.log("📡 API appelée : /api/messaging/status");
  res.json({ status: messagingStatus, qrCode: messagingQrCode });
};

// 📌 Récupérer l'historique des messages d'une conversation
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des messages :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

// 📌 Envoyer un message via WhatsApp
const sendMessage = async (req, res) => {
  let { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ error: "Champ manquant" });

  try {
    if (!to.endsWith("@c.us")) {
      to = to.replace(/\s/g, "").replace(/[^0-9]/g, "") + "@c.us";
    }

    console.log(`📤 Envoi du message à ${to} : ${message}`);

    await messagingClient.sendMessage(to, message);

    const newMessage = await Message.create({
      chatId: to,
      from: "Moi",
      body: message,
      timestamp: Date.now(),
    });

    if (io) {
      io.emit("newMessage", newMessage);
    }

    res.json({ success: true, message: "Message envoyé !" });
  } catch (error) {
    console.error("❌ Erreur d'envoi de message :", error);
    res.status(500).json({ error: "Erreur d'envoi", details: error.message });
  }
};

// 📌 Gérer la déconnexion de WhatsApp Web
messagingClient.on("disconnected", async (reason) => {
  console.log("⚠️ WhatsApp Web s'est déconnecté ! Raison :", reason);

  messagingStatus = "En attente du QR Code";
  messagingQrCode = null;

  setTimeout(() => {
    console.log("🔄 Redémarrage de WhatsApp Web...");
    messagingClient.initialize();
  }, 5000);
});

// 📌 Récupérer la liste des conversations WhatsApp
const getChats = async (req, res) => {
  try {
    if (!messagingClient?.info?.wid) {
      console.warn("⚠️ WhatsApp Web n'est pas encore connecté !");
      return res.status(503).json({ error: "WhatsApp Web non connecté" });
    }

    console.log("✅ Récupération des conversations...");

    const chats = await messagingClient.getChats();

    if (!chats.length) {
      console.warn("⚠️ Aucune conversation trouvée.");
      return res.json([]);
    }

    console.log(`✅ ${chats.length} conversations récupérées`);

    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        let contactName = chat.name || chat.id.user;

        try {
          const contact = await messagingClient.getContactById(
            chat.id._serialized
          );
          if (contact) {
            contactName = contact.pushname || contact.name || chat.id.user;
          }
        } catch (error) {
          console.warn(
            `⚠️ Impossible de récupérer les infos de ${chat.id._serialized}`
          );
        }

        return {
          id: chat.id._serialized,
          name: contactName,
          lastMessage: chat.lastMessage?.body || "Aucun message",
          timestamp: chat.lastMessage?.timestamp || null,
        };
      })
    );

    res.json(formattedChats);
  } catch (error) {
    console.error("❌ Erreur récupération des chats :", error);
    res.status(500).json({
      error: "Erreur récupération des conversations",
      details: error.message,
    });
  }
};

// 📌 Récupérer les infos d'un contact
const getContact = async (req, res) => {
  const { chatId } = req.params;

  try {
    const contact = await messagingClient.getContactById(chatId);
    const contactName = contact?.pushname || contact?.name || chatId;

    res.json({ id: chatId, name: contactName });
  } catch (error) {
    console.error(`❌ Erreur récupération du contact ${chatId} :`, error);
    res.status(500).json({ error: "Impossible de récupérer le contact" });
  }
};

/* -------------------------------------------------------------------------- */
/*                         🔄 Initialisation WebSocket                        */
/* -------------------------------------------------------------------------- */
const setupWebSocket = (server) => {
  if (!io) {
    // ✅ Évite de réinitialiser WebSocket
    io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("⚡ Un utilisateur s'est connecté au WebSocket");

      socket.on("disconnect", () => {
        console.log("❌ Un utilisateur s'est déconnecté du WebSocket");
      });
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          🚀 Initialisation WhatsApp                        */
/* -------------------------------------------------------------------------- */
console.log("🚀 Démarrage de WhatsApp Web...");
messagingClient.initialize();

module.exports = {
  getMessagingStatus,
  sendMessage,
  getMessages,
  getChats,
  getContact, // ✅ Ajouté pour la récupération des contacts
  setupWebSocket, // ✅ Ajouté pour le WebSocket
};
