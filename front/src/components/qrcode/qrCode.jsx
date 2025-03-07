import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const QRCodeComponent = ({ apiEndpoint }) => {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState("Chargement...");
  const [loading, setLoading] = useState(false);

  const fetchQRCode = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      setStatus(response.data.status);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error("❌ Erreur QR Code:", error);
      setStatus("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, [apiEndpoint]);

  // 🔄 Fonction pour reset la session
const resetSession = async () => {
  setLoading(true);
  try {
    const response = await axios.get("http://localhost:3000/api/reset-session");
    console.log("🔄 Réinitialisation réponse :", response.data);

    setStatus(response.data.message);
    setQrCode(null); // Efface l'ancien QR Code

    // 🔄 Redemande un QR Code immédiatement après reset
    setTimeout(fetchQRCode, 3000);
  } catch (error) {
    console.error("❌ Erreur de réinitialisation :", error);
    setStatus("Impossible de réinitialiser la session.");
  }
  setLoading(false);
};

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Statut</h1>
      <p>{status}</p>
      {qrCode ? (
        <img src={qrCode} alt="QR Code WhatsApp" className="p-2 mt-4 bg-white border shadow-md" />
      ) : (
        <p className="text-red-500">⚠️ Aucun QR Code disponible</p>
      )}
      
      {/* 🔄 Bouton pour reset la session */}
      <button
        onClick={resetSession}
        disabled={loading}
        className="hover:bg-red-600 px-4 py-2 mt-4 text-white bg-red-500 rounded-lg"
      >
        {loading ? "Réinitialisation..." : "Réinitialiser QR Code"}
      </button>
    </div>
  );
};

QRCodeComponent.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
};

export default QRCodeComponent;
