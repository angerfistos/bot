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
        //console.log("📩 Données reçues du backend :", JSON.stringify(data, null, 2));

        if (data && Array.isArray(data)) {
          const updatedConversations = await Promise.all(
            data.map(async (chat) => {
              const chatId = typeof chat.id === "object" ? chat.id._serialized : chat.id;
              let chatName = chat.name;

              // ✅ Vérifier si un dernier message existe
              let lastMessage = "Aucun message";
              if (chat.lastMessage) {
                lastMessage =
                  typeof chat.lastMessage === "string"
                    ? chat.lastMessage
                    : chat.lastMessage.body || "Message non lisible";
              }

              // ✅ Vérifier si un timestamp existe
              let timestamp = null;
              if (chat.timestamp) {
                timestamp = new Date(chat.timestamp * 1000).toLocaleTimeString();
              }

              // ✅ Récupération du nom du contact si absent
              if (!chat.name || chat.name === chatId) {
                try {
                  const contactData = await fetchData(`messaging/contact/${chatId}`);
                  chatName = contactData?.name || chatId; // ✅ Si pas de nom, on garde l'ID
                } catch (error) {
                  console.error(`❌ Erreur récupération du contact ${chatId} :`, error);
                  chatName = chatId; // ✅ Si erreur, on affiche le numéro
                }
              }

              return {
                id: chatId,
                name: chatName,
                lastMessage,
                timestamp,
              };
            })
          );

          setConversations(updatedConversations);
          setError(null);
        } else {
          console.error("⚠️ Données non valides :", data);
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
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm p-4 bg-white border-r h-[600px] overflow-y-auto">
      <h2 className="text-lg font-bold">📩 Conversations</h2>

      {loading && <p className="text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && conversations.length === 0 && !error && (
        <p className="text-gray-500">Aucune conversation disponible.</p>
      )}

      <ul>
        {conversations.map((chat) => (
          <li key={chat.id} className="hover:bg-gray-100 flex items-center justify-between p-3 border-b cursor-pointer"
              onClick={() => chat.id && onSelectChat(chat.id)}>
            <div>
              <strong>{chat.name}</strong> {/* ✅ Affiche bien le nom du contact */}
              <p className="text-sm text-gray-500">{chat.lastMessage}</p>
            </div>
            <span className="text-xs text-gray-400">{chat.timestamp || ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
