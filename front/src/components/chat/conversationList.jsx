import { useEffect, useState } from "react";
import { fetchData } from "../../services/ApiRequest";

const ConversationsList = ({ onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const data = await fetchData("messaging/conversations");
      if (!data) {
        setError("Impossible de récupérer les conversations.");
      } else {
        setConversations(data);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // 🔄 Rafraîchit toutes les 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm p-4 bg-white border-r">
      <h2 className="text-lg font-bold">📩 Conversations</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {conversations.map((chat) => (
          <li
            key={chat.id}
            className="hover:bg-gray-100 p-3 border-b cursor-pointer"
            onClick={() => onSelectChat(chat.id)}
          >
            <strong>{chat.name}</strong>
            <p className="text-sm text-gray-500">{chat.lastMessage || "Aucun message"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
