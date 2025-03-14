const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

const botClient = new Client({
  authStrategy: new LocalAuth({
    clientId: "bot-repondeur",
    dataPath: path.join(__dirname, "bot-data"), // 📂 Stocke la session ici
  }),
  puppeteer: { headless: true },
});

botClient
  .initialize()
  .then(() => console.log("✅ Session Bot & Répondeur initialisée"))
  .catch((error) => console.error("❌ Erreur lors du démarrage :", error));

module.exports = botClient;
