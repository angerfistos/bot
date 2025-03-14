import { useEffect, useRef, useState } from "react";
import { fetchData, sendData } from "../../services/ApiRequest";

const ChatWindow = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState(chatId || "Chargement...");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!chatId) {
      console.warn("⚠️ Aucun `chatId` reçu dans ChatWindow.jsx !");
      return;
    }

    const fetchMessages = async () => {
      const data = await fetchData(`messaging/messages/${chatId}`);
      if (data && Array.isArray(data)) {
        setMessages(
          data.map((msg) => ({
            from: msg.from,
            body: typeof msg.body === "string" ? msg.body : "[Message non lisible]",
            timestamp: msg.timestamp || new Date().getTime(),
          }))
        );
      } else {
        console.warn("⚠️ Données des messages non valides :", data);
      }
    };

    const fetchContactName = async () => {
      const contactData = await fetchData(`messaging/contact/${chatId}`);
      if (contactData?.name) {
        setContactName(contactData.name);
      }
    };

    fetchMessages();
    fetchContactName();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!chatId) {
      console.error("❌ Erreur : `chatId` est `undefined` lors de l'envoi du message !");
      return;
    }

    const response = await sendData("messaging/send-message", {
      to: chatId,
      message,
    });

    if (response && response.success) {
      const newMessage = {
        from: "Moi",
        body: message,
        timestamp: new Date().getTime(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full p-4">
      <h2 className="flex items-center text-lg font-bold">
        <button onClick={onBack} className="p-2 mr-2 text-blue-500">🔙</button>
        💬 {contactName}
      </h2>

      {chatId ? (
        <div ref={chatContainerRef} className="bg-gray-50 max-h-[50vh] flex-1 p-2 mt-2 overflow-y-auto rounded-lg">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-1 rounded-lg max-w-xs ${
              msg.from === "Moi" ? "bg-green-200 ml-auto text-right" : "bg-gray-200"
            }`}>
              <p>{msg.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">🔍 Sélectionne une conversation</p>
      )}

      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Écrire un message..."
          className="flex-1 p-2 border rounded-l"
          disabled={!chatId}
        />

        <button onClick={handleSendMessage} className="p-2 text-white bg-blue-500 rounded-r" disabled={!chatId}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
