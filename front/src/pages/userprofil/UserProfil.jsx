import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Hook pour la redirection
import { fetchData, updateData, deleteData } from "../../services/ApiRequest";
import { getToken, removeToken } from "../../services/auth";

function UserProfil() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Initialisation du hook de navigation

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchData("users/me", token);
        if (!data) {
          setError("Erreur lors de la récupération des données");
        } else {
          setUser(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || ""
          });
        }
      } catch (err) {
        console.error("❌ Erreur API :", err);
        setError("Impossible de récupérer les informations.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("Utilisateur non authentifié");
      return;
    }

    try {
      console.log("📡 Envoi des données :", formData);
      const response = await updateData("users/update", formData, token);
      if (response && response.user) {
        setMessage("Profil mis à jour avec succès !");
        setUser(response.user);
      } else {
        setError("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("❌ Erreur mise à jour :", err);
      setError("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (!confirmDelete) return;

    const token = getToken();
    if (!token) {
      setError("Utilisateur non authentifié");
      return;
    }

    try {
      console.log("🗑 Suppression du compte en cours...");
      const response = await deleteData("users/delete", token);

      if (response && response.message === "Compte supprimé avec succès") {
        setMessage("Compte supprimé avec succès. Redirection en cours...");

        // ✅ Supprime le token de l'utilisateur et redirige
        removeToken();
        setTimeout(() => {
          navigate("/"); // 🔄 Redirige vers la page d'inscription
        }, 2000); // ⏳ Petite attente avant la redirection
      } else {
        setError("Erreur lors de la suppression du compte.");
      }
    } catch (err) {
      console.error("❌ Erreur suppression :", err);
      setError("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Profil utilisateur</h1>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {loading ? (
        <p>Chargement des informations...</p>
      ) : user ? (
        <>
          {/* Formulaire de mise à jour */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Prénom :</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border"
              />
            </div>
            <div>
              <label>Nom :</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border"
              />
            </div>
            <div>
              <label>Email :</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border"
              />
            </div>
            <div>
              <label>Téléphone :</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border"
              />
            </div>
            <button
              type="submit"
              className="hover:bg-blue-600 px-4 py-2 text-white bg-blue-500 rounded"
            >
              Mettre à jour
            </button>
          </form>

          {/* Bouton de suppression */}
          <button
            onClick={handleDeleteAccount}
            className="hover:bg-red-600 px-4 py-2 mt-4 text-white bg-red-500 rounded"
          >
            Supprimer mon compte
          </button>
        </>
      ) : (
        <p>Aucune information utilisateur trouvée.</p>
      )}
    </div>
  );
}

export default UserProfil;
