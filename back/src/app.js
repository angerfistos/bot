const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user.routes");
const messagingRoutes = require("./routes/messaging.routes"); // ✅ Routes API
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

/* -------------------------------------------------------------------------- */
/*                                Configuration CORS                          */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // ✅ Autorise le front (React)
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
/*                         Définition des routes                              */
/* -------------------------------------------------------------------------- */
app.use("/api/users", userRoutes);
app.use("/api/messaging", messagingRoutes);

/* -------------------------------------------------------------------------- */
/*                         Initialisation WebSocket                           */
/* -------------------------------------------------------------------------- */
const { setupWebSocket } = require("./controllers/messaging.controller"); // ✅ Correction du chemin
setupWebSocket(server); // ✅ Initialise WebSocket

/* -------------------------------------------------------------------------- */
/*                          🚀 LANCEMENT DU SERVEUR                           */
/* -------------------------------------------------------------------------- */
server.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
