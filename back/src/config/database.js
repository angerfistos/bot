/* -------------------------------------------------------------------------- */
/*                        Connexion à la base de données                      */
/* -------------------------------------------------------------------------- */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// 🔇 Désactiver les logs inutiles de Mongoose
mongoose.set("debug", false);
mongoose.set("strictQuery", false);
mongoose.set("bufferCommands", false); // ✅ Évite d'accumuler les requêtes en attente

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // ⏳ Évite les longues attentes de connexion
      socketTimeoutMS: 45000, // ⏳ Évite les déconnexions trop rapides
      keepAlive: true, // ✅ Maintient la connexion ouverte
      keepAliveInitialDelay: 300000, // ✅ Réduit les reconnexions inutiles
    });

    console.log(
      `✅ Connexion à MongoDB réussie sur ${
        process.env.MONGODB_URI.split("@")[1] || process.env.MONGODB_URI
      }`
    );
  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
