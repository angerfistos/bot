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
  const [modalMessage, setModalMessage] = useState(""); // ✅ Stocker le message de la modal
  const [isResetting, setIsResetting] = useState(false); // ✅ Empêcher la vérification pendant la réinitialisation

  useEffect(() => {
    let interval;
    const checkConnection = async () => {
      if (isResetting) return; // ✅ Bloquer les appels API si la session est en réinitialisation

      const response = await fetchData("messaging/status");
      if (response && response.status.includes("connectée")) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();

    // ✅ Vérifier seulement si la session est active et pas en reset
    if (isConnected && !isResetting) {
      interval = setInterval(checkConnection, 5000);
    }

    return () => clearInterval(interval);
  }, [isConnected, isResetting]); // ✅ Ajout de `isResetting` pour éviter l'appel infini

  const handleResetSession = async () => {
    setIsResetting(true); // ✅ Bloquer les appels API le temps de la réinitialisation
    setModalMessage("⏳ Réinitialisation en cours..."); // ✅ Affichage immédiat du message
    setIsModalOpen(true); // ✅ Garde la modal ouverte pour afficher le message

    const response = await sendData("messaging/reset-session");
    if (response?.success) {
      setModalMessage("✅ Session réinitialisée. Scannez un nouveau QR Code."); // ✅ Afficher la confirmation
      setIsConnected(false); // ✅ Forcer l'affichage du QR Code
    } else {
      setModalMessage("❌ Erreur lors de la réinitialisation.");
    }

    // ✅ Fermer la modal après 3 secondes et réactiver la vérification
    setTimeout(() => {
      setIsModalOpen(false);
      setIsResetting(false);
    }, 3000);
  };

  return (
    <div className="flex p-4 bg-white rounded-lg shadow-md">
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

      {/* ✅ Modal de confirmation + affichage du message */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleResetSession}
        title="Confirmer la déconnexion"
        message={modalMessage || "Voulez-vous vraiment vous déconnecter? Cette action réinitialisera votre session."}
      />
    </div>
  );
}

export default Dashboard;
