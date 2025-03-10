import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { removeToken, isAuthenticated } from "../services/auth";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const isHomePage = location.pathname === "/";

  // 🔥 Fonction de déconnexion
  const handleLogout = () => {
    removeToken(); 
    navigate("/"); // ✅ Redirige vers la page de connexion
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {!isHomePage && (
        <>
          <div className="flex gap-4 p-4 bg-gray-200">
            <nav className="flex flex-grow gap-4 p-4 bg-gray-200">
              <Link to="/dashboard" className="text-blue-500">Accueil</Link>
              <Link to="/params" className="text-blue-500">Paramètres</Link>
              <Link to="/about" className="text-blue-500">À propos</Link>
            </nav>

            {/* Afficher "Se déconnecter?" uniquement si l'utilisateur est connecté */}
            {isLoggedIn && (
              <nav className="flex gap-4 p-4 ml-auto bg-gray-200">
                <Link to="/userprofil" className="text-blue-500">Profil</Link>
                <button onClick={handleLogout} className="text-blue-500">Se déconnecter?</button> {/* ✅ Bouton de déconnexion */}
              </nav>
            )}
          </div>
        </>
      )}

      <main className="flex-grow p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
