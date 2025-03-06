const jwt = require("jsonwebtoken");
require("dotenv").config(); // 🔥 Charge les variables d'environnement

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  //console.log("🔍 Token reçu dans le backend :", token); 

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // ✅ Utilisation de .env
    req.user = decoded; // ✅ Ajoute l'ID utilisateur dans la requête

    //console.log("🔑 ID utilisateur extrait :", req.user.id); 
    next();
  } catch (error) {
    res.status(400).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;
