import { useEffect, useState } from "react";
import { fetchData, sendData } from "../../services/ApiRequest";

const ChatWindow = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState(chatId); // Par défaut, affiche l'ID

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await fetchData(`messaging/messages/${chatId}`);
      if (data) {
        setMessages(data);
      }
    };

    const fetchContactName = async () => {
      const contactData = await fetchData(`messaging/contact/${chatId}`);
      if (contactData?.name) {
        setContactName(contactData.name);
      }
    };

    fetchMessages();
    fetchContactName(); // Récupère le nom du contact

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

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
    <div className="flex flex-col flex-1 p-4">
      <h2 className="flex items-center text-lg font-bold">
        <button onClick={onBack} className="p-2 mr-2 text-blue-500">🔙</button>
        💬 {contactName} {/* Affiche le nom du contact */}
      </h2>

      <div className="bg-gray-50 flex-1 p-2 mt-2 overflow-y-auto rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded-lg max-w-xs ${msg.from === "Moi" ? "bg-green-200 ml-auto text-right" : "bg-gray-200"}`}>
            <p>{msg.body}</p>
          </div>
        ))}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 p-2 border rounded-l"
        />
        <button onClick={handleSendMessage} className="p-2 text-white bg-blue-500 rounded-r">Envoyer</button>
      </div>
    </div>
  );
};

export default ChatWindow;
