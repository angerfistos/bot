import { useEffect, useState } from "react";
import axios from "axios";

const QRCodeComponent = () => {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState("Chargement...");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/bot-status");
        setStatus(response.data.status);
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error("Erreur lors de la récupération du QR Code", error);
      }
    };

    fetchQRCode();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Statut du bot</h1>
      <p>{status}</p>
      {qrCode ? <img src={qrCode} alt="QR Code WhatsApp" className="mt-4" /> : <p>Aucun QR Code disponible</p>}
    </div>
  );
};

export default QRCodeComponent;