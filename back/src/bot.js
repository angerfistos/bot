const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const client = new Client({
  authStrategy: new LocalAuth(),
});

let botStatus = "En attente du QR Code";
let qrCodeBase64 = null;
let qrLogged = false;

client.on("qr", async (qr) => {
  if (!qrLogged) {
    console.log("📸 QR Code généré, scanne-le avec ton téléphone.");
    qrLogged = true;
  }
  botStatus = "QR Code généré, en attente de scan";
  qrCodeBase64 = await qrcode.toDataURL(qr);
});

client.on("ready", () => {
  console.log("✅ Bot WhatsApp Web connecté !");
  botStatus = "WhatsApp Web est connecté ! ✅";
  qrCodeBase64 = null;
});

client.initialize();

// 🔥 Exporter les fonctions pour utilisation dans `app.js`
const getBotStatus = (req, res) => {
  res.json({ status: botStatus, qrCode: qrCodeBase64 });
};

module.exports = { getBotStatus };
