import { useEffect, useState } from "react";
import { fetchData } from "../../services/ApiRequest";
import QRCodeComponent from "../../components/qrcode/qrCode";

const BotQrPage = () => {
  const [botStatus, setBotStatus] = useState("Chargement..."); // 🔄 Suivi du statut du bot
  const [isConnected, setIsConnected] = useState(false); // ✅ Vérifie si le bot est connecté
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBotStatus = async () => {
      try {
        const response = await fetchData("bot-status");
        if (response) {
          setBotStatus(response.status);
          setIsConnected(response.status.includes("connecté")); // ✅ Cache le QR Code si connecté
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du statut du bot :", error);
        setError("Impossible de récupérer le statut du bot.");
      }
    };

    checkBotStatus();
    const interval = setInterval(checkBotStatus, 5000); // 🔄 Vérifie toutes les 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <h1 className="text-2xl font-bold">Connexion du Bot WhatsApp</h1>
      {error && <p className="text-red-500">{error}</p>}

      {isConnected ? (
        <p className="mt-4 font-bold text-green-500">✅ Bot WhatsApp connecté !</p>
      ) : (
        <QRCodeComponent apiEndpoint="http://localhost:3000/api/bot-status" />
      )}
    </div>
  );
};

export default BotQrPage;
