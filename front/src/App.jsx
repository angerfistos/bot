import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// 📌 Importation des pages publiques
import Login from "./pages/login/Login";
import About from "./pages/about/About";
import Register from "./pages/register/Register";
import NotFound from "./pages/notfound/NotFound";

// 🔒 Importation des pages protégées
import Dashboard from "./pages/dashboard/Dashboard";
import Params from "./pages/params/Params";
import UserProfil from "./pages/userprofil/UserProfil";
import BotQrPage from "./pages/bot/BotQrPage";

// 🔐 Importation du service d'authentification
import { isAuthenticated } from "./services/auth";

// 🔒 Composant pour protéger les routes nécessitant une authentification
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* 🏠 Routes publiques */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* 🔒 Routes protégées (accessibles uniquement si authentifié) */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/bot-qr" element={<PrivateRoute element={<BotQrPage />} />} />
          <Route path="/params" element={<PrivateRoute element={<Params />} />} />
          <Route path="/userprofil" element={<PrivateRoute element={<UserProfil />} />} />

          {/* 🚫 Route pour les pages non trouvées */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
