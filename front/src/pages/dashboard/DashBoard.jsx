import { useEffect, useState } from "react";
import { fetchData } from "../../services/ApiRequest";
import { getToken } from "../../services/auth";
import QRCodeComponent from "../../components/bot/qrCode";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setError("Utilisateur non authentifié");
        return;
      }

      const data = await fetchData("users/me", token);
      if (!data) {
        setError("Erreur lors de la récupération des données");
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <h1 className="text-2xl font-bold">
        {user ? `Bonjour, ${user.firstName} ! 👋` : "Bonjour ! 👋"}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <QRCodeComponent />
    </div>
  );
}

export default Dashboard;
