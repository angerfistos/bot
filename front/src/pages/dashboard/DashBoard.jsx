import { useEffect, useState } from "react";
import { fetchData } from "../../services/ApiRequest";
import QRCodeComponent from "../../components/qrcode/qrCode";
import ConversationsList from "../../components/chat/conversationList";
import ChatWindow from "../../components/chat/chatWindow";

function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      const response = await fetchData("messaging/status");
      if (response && response.status.includes("connectée")) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      {/* ✅ Si WhatsApp Web N'EST PAS connecté, on affiche le QR Code */}
      {!isConnected ? (
        <div className="flex items-center justify-center w-full">
          <QRCodeComponent apiEndpoint="http://localhost:3000/api/messaging/status" />
        </div>
      ) : (
        <>
          <ConversationsList onSelectChat={setSelectedChat} />
          {selectedChat ? (
            <ChatWindow chatId={selectedChat} onBack={() => setSelectedChat(null)} />
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-gray-500">Sélectionne une conversation</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
