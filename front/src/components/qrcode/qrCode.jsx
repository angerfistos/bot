import { useEffect, useState } from "react";
import axios from "axios";

const QRCodeComponent = ({ apiEndpoint }) => {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState("Chargement...");
  const [loading, setLoading] = useState(false);

  const fetchQRCode = async () => {
    try {
      console.log("📡 Requête envoyée à :", apiEndpoint);
      const response = await axios.get(apiEndpoint);
      setStatus(response.data.status);

      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      } else {
        setQrCode(null);
      }
    } catch (error) {
      console.error("❌ Erreur QR Code:", error);
      setStatus("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    fetchQRCode();
    const interval = setInterval(fetchQRCode, 5000);
    return () => clearInterval(interval);
  }, [apiEndpoint]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Statut WhatsApp</h1>
      <p>{status}</p>

      {qrCode ? (
        <img src={qrCode} alt="QR Code WhatsApp" className="p-2 mt-4 bg-white border shadow-md" />
      ) : (
        <p className="text-red-500">⚠️ En attente de connexion...</p>
      )}
    </div>
  );
};

export default QRCodeComponent;
