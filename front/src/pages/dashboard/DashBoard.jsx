import { useEffect, useState } from "react";
import { fetchData, sendData } from "../../services/ApiRequest";
import QRCodeComponent from "../../components/qrcode/QrCode";
import ConversationsList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import Modal from "../../components/modal/Modal"; 

function Dashboard() {
  const [isConnected, setIsConnected] = useState(false); // État de la connexion à WhatsApp Web
  const [selectedChat, setSelectedChat] = useState(null); // État de la conversation sélectionnée
  const [isModalOpen, setIsModalOpen] = useState(false); // État de la modal

  useEffect(() => {
    const checkConnection = async () => {
      const response = await fetchData("messaging/status");
      setIsConnected(response?.status.includes("connectée") || false);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResetSession = async () => {
    setIsModalOpen(false); // ✅ Fermer la modal après confirmation

    const response = await sendData("messaging/reset-session");
    if (response?.success) {
      alert("Session réinitialisée. Scannez un nouveau QR Code.");
      setIsConnected(false); // ✅ Forcer l'affichage du QR Code
    } else {
      alert("Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="flex p-4 m-8 bg-white rounded-lg shadow-md">
      {/* ✅ Si WhatsApp Web N'EST PAS connecté, on affiche le QR Code */}
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center w-full">
          <QRCodeComponent apiEndpoint="http://localhost:3000/api/messaging/status" />
          <button
            onClick={() => setIsModalOpen(true)} // ✅ Ouvre la modal
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg"
          >
            🔄 Réinitialiser la session
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-1/3">
            {/* ✅ Titre Conversations + Bouton de déconnexion */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setIsModalOpen(true)} // ✅ Ouvre la modal
                className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg"
              >
                🔄 Déconnecter la session
              </button>
            </div>

            {/* ✅ Liste des conversations */}
            <ConversationsList onSelectChat={setSelectedChat} />
          </div>

          {/* ✅ Affichage du chat si une conversation est sélectionnée */}
          {selectedChat ? (
            <ChatWindow chatId={selectedChat} onBack={() => setSelectedChat(null)} />
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-gray-500">Sélectionne une conversation</p>
            </div>
          )}
        </>
      )}

      {/* ✅ Modal de confirmation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleResetSession}
        title="Confirmer la déconnexion"
        message="Voulez-vous vraiment vous déconnecter? Cette action réinitialisera votre session."
      />
    </div>
  );
}

export default Dashboard;
