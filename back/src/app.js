const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user.routes");
const botRoutes = require("./bot"); 
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const cors = require("cors"); 

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------------------------------------------------------------- */
/*                                Configuration CORS                          */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Remplace par ton domaine React
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                       Connexion à la base de données                       */
/* -------------------------------------------------------------------------- */
connectDB();

/* -------------------------------------------------------------------------- */
/*                        Documentation Swagger                               */
/* -------------------------------------------------------------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/* -------------------------------------------------------------------------- */
/*                         Définition des routes                              */
/* -------------------------------------------------------------------------- */

app.use("/api/users", userRoutes);
app.get("/api/bot-status", botRoutes.getBotStatus); // 🔥 Utilise bot.js

/* -------------------------------------------------------------------------- */
/*                          🚀 LANCEMENT DU SERVEUR                           */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📜 Documentation Swagger : http://localhost:${PORT}/api-docs`);
});

const jwt = require("jsonwebtoken");
