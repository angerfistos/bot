import { useEffect, useState } from "react";
import { fetchData } from "../../services/ApiRequest";

const ConversationsList = ({ onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await fetchData("messaging/chats");
        console.log("📩 Données reçues du backend :", data);

        if (data && Array.isArray(data)) {
          setConversations(data);
          setError(null);
        } else {
          console.error("⚠️ Données non valides !");
          setError("Format des données incorrect.");
          setConversations([]);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des conversations :", error);
        setError("Impossible de charger les conversations.");
        setConversations([]);
      }
      setLoading(false);
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // 🔄 Rafraîchit toutes les 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm p-4 bg-white border-r">
      <h2 className="text-lg font-bold">📩 Conversations</h2>

      {loading && <p className="text-gray-500">Chargement des conversations...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && conversations.length === 0 && !error && (
        <p className="text-gray-500">Aucune conversation disponible.</p>
      )}

      <ul>
        {conversations.map((chat) => (
          <li
            key={chat.id}
            className="hover:bg-gray-100 flex items-center justify-between p-3 border-b cursor-pointer"
            onClick={() => onSelectChat(chat.id)}
          >
            <div>
              <strong>{chat.name || "Utilisateur inconnu"}</strong>
              <p className="text-sm text-gray-500">{chat.lastMessage || "Aucun message"}</p>
            </div>
            <span className="text-xs text-gray-400">
              {chat.timestamp ? new Date(chat.timestamp * 1000).toLocaleTimeString() : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
