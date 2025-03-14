const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

const messagingClient = new Client({
  authStrategy: new LocalAuth({
    clientId: "messaging",
    dataPath: path.join(__dirname, "messaging-data"), // 📂 Stocke la session ici
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

messagingClient
  .initialize()
  .then(() => console.log("✅ Session Messagerie WhatsApp initialisée !"))
  .catch((error) => console.error("❌ Erreur d'initialisation :", error));

module.exports = messagingClient;
