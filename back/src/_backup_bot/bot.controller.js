const botClient = require("../../sessions/botSession");
const qrcode = require("qrcode");

let qrCodeImage = null;

/* -------------------------------------------------------------------------- */
/*                         🔄 Gestion du QR Code                              */
/* -------------------------------------------------------------------------- */
botClient.on("qr", async (qr) => {
  console.log("📌 Nouveau QR Code généré !");
  qrCodeImage = await qrcode.toDataURL(qr);
});

/* -------------------------------------------------------------------------- */
/*                          ✅ Connexion réussie                              */
/* -------------------------------------------------------------------------- */
botClient.on("ready", () => {
  console.log("✅ Bot connecté !");
  qrCodeImage = null; // Supprime le QR Code après connexion
});

/* -------------------------------------------------------------------------- */
/*                          ⚠️ Gestion des Déconnexions                      */
/* -------------------------------------------------------------------------- */
botClient.on("disconnected", async (reason) => {
  console.log("⚠️ Bot déconnecté :", reason);

  setTimeout(() => {
    if (!botClient?.info?.wid) {
      console.log("🔄 Redémarrage sécurisé du bot...");
      botClient.initialize();
    }
  }, 5000);
});

/* -------------------------------------------------------------------------- */
/*                        🛠️ Fonctions API REST                              */
/* -------------------------------------------------------------------------- */

// 📌 Récupérer le QR Code du bot
const getBotQrCode = async (req, res) => {
  if (!qrCodeImage) {
    return res.status(404).json({ message: "QR Code non disponible" });
  }
  res.json({ qrCode: qrCodeImage });
};

// 📌 Redémarrer le bot pour appliquer les changements
const restartBot = async (req, res) => {
  try {
    console.log("♻️ Redémarrage du bot en cours...");
    await botClient.destroy();
    await botClient.initialize();

    res.json({ message: "✅ Bot redémarré avec succès !" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Erreur lors du redémarrage", error: error.message });
  }
};

module.exports = {
  getBotQrCode,
  restartBot, // ✅ Ajout d'une API pour redémarrer le bot
};
