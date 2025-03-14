const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

// 📌 Définit un chemin spécifique pour stocker les sessions
const sessionPath = path.join(__dirname, "messaging-data");

// 📌 Initialise le client WhatsApp Web avec le bon chemin
const messagingClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: sessionPath, // ✅ FORCÉ à enregistrer dans `sessions/messaging-data`
    clientId: "messaging",
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

messagingClient.initialize();

module.exports = messagingClient;
