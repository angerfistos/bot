const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");

const messagingClient = new Client({
  authStrategy: new LocalAuth({ clientId: "messaging" }),
});

let messagingStatus = "En attente du QR Code";
let messagingQrCode = null;
let messages = [];

messagingClient.on("qr", async (qr) => {
  console.log("📸 QR Code généré.");
  messagingStatus = "QR Code prêt, scannez pour connecter WhatsApp Web";
  messagingQrCode = await qrcode.toDataURL(qr);
});

messagingClient.on("ready", async () => {
  console.log("✅ Messagerie WhatsApp Web connectée !");
  messagingStatus = "Messagerie connectée ✅";
  messagingQrCode = null;
});

messagingClient.on("message", async (msg) => {
  console.log(`📩 Message reçu de ${msg.from}: ${msg.body}`);

  messages.push({
    from: msg.from,
    body: msg.body,
    timestamp: new Date().getTime(),
  });

  if (messages.length > 50) messages.shift();
});

const getMessagingStatus = (req, res) => {
  res.json({ status: messagingStatus, qrCode: messagingQrCode });
};

const getMessages = (req, res) => {
  console.log("📩 Messages stockés :", messages);
  res.json(messages);
};

const getChats = async (req, res) => {
  try {
    const chats = await messagingClient.getChats();
    const formattedChats = chats.map((chat) => ({
      id: chat.id._serialized,
      name: chat.name || chat.id.user,
      lastMessage:
        messages.find((m) => m.from === chat.id._serialized)?.body ||
        "Aucun message",
      timestamp:
        messages.find((m) => m.from === chat.id._serialized)?.timestamp || null,
    }));

    res.json(formattedChats);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des chats",
      details: error.message,
    });
  }
};

const sendMessage = async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ error: "Champ manquant" });

  try {
    await messagingClient.sendMessage(to, message);
    messages.push({
      from: "Moi",
      body: message,
      timestamp: new Date().getTime(),
    });
    res.json({ success: true, message: "Message envoyé !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur d'envoi", details: error.message });
  }
};

const resetSession = async (req, res) => {
  try {
    console.log(
      "🔄 Réinitialisation de la session WhatsApp Web pour l'utilisateur..."
    );

    if (messagingClient.info?.wid) {
      console.log(
        `✅ Utilisateur WhatsApp Web détecté : ${messagingClient.info.wid}`
      );
      console.log("🔄 Déconnexion de cet utilisateur...");

      await messagingClient.logout(); // Déconnecte uniquement l’utilisateur actuel

      console.log("🗑️ Suppression de la session de l'utilisateur...");
      const sessionPath = path.join(
        __dirname,
        `../.wwebjs_auth/session-${messagingClient.info.wid}`
      );
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log("✅ Session supprimée !");
      } else {
        console.log(
          "⚠️ Aucune session spécifique trouvée, mais WhatsApp sera redémarré."
        );
      }

      console.log(
        "🔄 Relancement de WhatsApp Web pour générer un nouveau QR Code..."
      );
      await messagingClient.initialize(); // Redémarre pour afficher un QR Code

      return res.json({
        success: true,
        message:
          "Session de l'utilisateur réinitialisée. Scanne le nouveau QR Code.",
      });
    }

    console.log(
      "⚠️ Aucune session active détectée. Génération d’un QR Code..."
    );
    await messagingClient.initialize();

    res.json({
      success: true,
      message: "Nouveau QR Code généré. Scanne-le avec ton téléphone.",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation :", error);
    res.status(500).json({
      error: "Impossible de réinitialiser la session",
      details: error.message,
    });
  }
};


module.exports = {
  getMessagingStatus,
  sendMessage,
  getMessages,
  getChats,
  resetSession,
};
