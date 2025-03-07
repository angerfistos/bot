import { useEffect, useState } from "react";
import { fetchData } from "../../services/ApiRequest";
import { getToken } from "../../services/auth";
import QRCodeComponent from "../../components/qrcode/qrCode";
import ChatWindow from "../../components/chat/ChatWindow";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setError("Utilisateur non authentifié");
        return;
      }
      const data = await fetchData("users/me", token);
      if (!data) setError("Erreur lors de la récupération des données");
      else setUser(data);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      const response = await fetchData("messaging-status");
      if (response) {
        setIsConnected(response.status.includes("connecté"));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">
        {user ? `Bonjour, ${user.firstName} ! 👋` : "Bonjour ! 👋"}
      </h1>
      {error && <p className="text-red-500">{error}</p>}

      {isConnected ? (
        <ChatWindow />
      ) : (
        <QRCodeComponent apiEndpoint="http://localhost:3000/api/messaging-status" />
      )}
    </div>
  );
}

export default Dashboard;
