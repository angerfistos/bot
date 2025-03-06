import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/login/Login";
import About from "./pages/about/About";
import Dashboard from "./pages/dashboard/Dashboard";
import Params from "./pages/params/Params";
import UserProfil from "./pages/userprofil/UserProfil";
import Register from "./pages/register/Register";
import NotFound from "./pages/notfound/NotFound";
import { isAuthenticated } from "./services/auth"; // ✅ Utilisation de la fonction existante

// 🔒 Composant pour protéger les routes nécessitant une authentification
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* 🔒 Routes protégées */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/params" element={<PrivateRoute element={<Params />} />} />
          <Route path="/userprofil" element={<PrivateRoute element={<UserProfil />} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
