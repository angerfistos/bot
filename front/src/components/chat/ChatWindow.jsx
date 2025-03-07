import { useEffect, useState } from "react";
import { fetchData, sendData } from "../../services/ApiRequest";
import { FaSearch, FaPaperPlane, FaSmile } from "react-icons/fa";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetchData("conversations");
      if (response) {
        setConversations(response);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      const response = await fetchData("messages");
      if (response) {
        // 🔥 Filtre les messages en fonction du contact sélectionné
        const filteredMessages = response.filter(
          msg => msg.from === selectedChat.id || msg.to === selectedChat.id
        );
        setMessages(filteredMessages);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage) return alert("Sélectionne une conversation et écris un message !");
    
    const response = await sendData("send-message", { to: selectedChat.id, message: newMessage });
    if (response.success) {
      setNewMessage("");
      setMessages([...messages, { from: "Moi", body: newMessage, timestamp: new Date() }]);
    } else {
      alert("Erreur d'envoi");
    }
  };

  return (
    <div className="flex h-[90vh] w-full max-w-5xl border rounded-lg shadow-lg bg-white">
      {/* Sidebar - Liste des contacts */}
      <div className="w-1/3 bg-gray-100 border-r">
        <div className="flex items-center p-3 border-b">
          <input
            type="text"
            placeholder="Rechercher..."
            className="flex-1 p-2 border rounded-lg"
          />
          <FaSearch className="ml-2 text-gray-600" />
        </div>
        <div className="h-full overflow-y-auto">
          {conversations.map((chat, index) => (
            <div
              key={index}
              className={`p-3 border-b hover:bg-gray-200 cursor-pointer ${
                selectedChat?.id === chat.id ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <p className="font-semibold">{chat.name}</p>
              <p className="text-sm text-gray-500">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fenêtre de chat */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center p-4 bg-gray-200 border-b">
          <h2 className="text-lg font-semibold">
            {selectedChat ? selectedChat.name : "Sélectionne une conversation"}
          </h2>
        </div>

        {/* Messages */}
        <div className="bg-gray-50 flex-1 p-4 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 max-w-xs rounded-lg shadow-md ${
                  msg.from === "Moi" ? "bg-green-500 text-white self-end ml-auto" : "bg-white text-gray-900 self-start mr-auto"
                }`}
              >
                <p className="text-xs text-gray-300">{msg.from}</p>
                <p>{msg.body}</p>
                <small className="block mt-1 text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            ))
          ) : (
            <p className="mt-10 text-center text-gray-500">Aucun message dans cette conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
