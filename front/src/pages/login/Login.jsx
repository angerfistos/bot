import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 🔥 Pour rediriger après connexion
import axios from "axios";
import { setToken } from "../../services/auth"; // 🔥 Service d'authentification
import Button from "../../components/buttons/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 Indicateur de chargement
  const [error, setError] = useState(null); // 🔥 Gestion des erreurs
  const navigate = useNavigate(); // 🔥 Permet la redirection après connexion

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // 🔥 Réinitialise les erreurs

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      console.log("✅ Réponse reçue du serveur :", response.data);

      if (response.data.token) {
        setToken(response.data.token); // ✅ Stocke le token JWT dans `localStorage`
        //alert(`Bienvenue, ${response.data.user?.firstName || "Utilisateur"} !`);
        navigate("/dashboard"); // ✅ Redirige vers la page du profil
      } else {
        throw new Error("Réponse invalide du serveur");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error.response?.data || error.message);
      setError(error.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-900">
      <div className="flex items-center justify-center">
        <video
          className="sm:max-w-sm md:max-w-md lg:max-w-lg w-full max-w-xs"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video/whitelogo.mp4" type="video/mp4" />
        </video>
      </div>
      <section className="dark:bg-gray-900 flex items-center justify-center">
        <div className="dark:border dark:bg-gray-800 dark:border-gray-700 w-full max-w-md p-6 bg-white rounded-lg shadow">
          <h1 className="md:text-2xl dark:text-white text-xl font-bold leading-tight tracking-tight text-center text-gray-900">
            Connexion
          </h1>

          {/* Affichage des erreurs */}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Votre email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Mot de passe
              </label>
              <input
                id="password"
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 w-4 h-4 border border-gray-300 rounded"
                />
                <span className="dark:text-gray-300 ml-2 text-sm text-gray-500">Se souvenir de moi</span>
              </label>
              <a href="#" className="hover:underline dark:text-blue-500 text-sm font-medium text-blue-600">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Désactiver le bouton pendant le chargement */}
            <Button text={loading ? "Connexion..." : "Se connecter"} type="submit" disabled={loading} />

            <p className="dark:text-gray-400 text-sm font-light text-center text-gray-500">
              Pas encore de compte ?{" "}
              <Link to="/register" className="hover:underline dark:text-blue-500 font-medium text-blue-600">
                S&apos;inscrire
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
