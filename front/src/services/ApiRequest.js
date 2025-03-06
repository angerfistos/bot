import { removeToken } from "./auth";

const API_BASE_URL = "http://localhost:3000/api";

/* -------------------------------------------------------------------------- */
/*                           🔹 Configuration API                              */
/* -------------------------------------------------------------------------- */

/**
 * Génère les headers avec ou sans token
 */
const getHeaders = (token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

/**
 * Vérifie si l'utilisateur est authentifié, sinon le déconnecte
 */
const checkAuth = async (response) => {
  if (response.status === 401) {
    console.warn("⛔ Token expiré, déconnexion en cours...");
    removeToken();
    window.location.href = "/";
    return null;
  }
  return response;
};

/* -------------------------------------------------------------------------- */
/*                        🔹 Requêtes GET (Récupérer)                         */
/* -------------------------------------------------------------------------- */

/**
 * Récupère des données via une requête GET
 */
export const fetchData = async (endpoint, token = null) => {
  try {
    console.log("📡 Requête GET envoyée à :", `${API_BASE_URL}/${endpoint}`);

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: getHeaders(token),
    });

    const checkedResponse = await checkAuth(response);
    if (!checkedResponse) return null;

    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur fetchData :", error);
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                        🔹 Requêtes POST / PUT                              */
/* -------------------------------------------------------------------------- */

/**
 * Envoie des données via une requête POST ou PUT
 */
export const sendData = async (
  endpoint,
  data,
  method = "POST",
  token = null
) => {
  try {
    console.log(`📡 Envoi ${method} à : ${API_BASE_URL}/${endpoint}`);
    console.log("📨 Données envoyées :", JSON.stringify(data));

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    const checkedResponse = await checkAuth(response);
    if (!checkedResponse) return null;

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("❌ Erreur backend :", errorResponse);
      throw new Error(
        errorResponse.message || "Erreur lors de l'envoi des données"
      );
    }

    const responseData = await response.json();
    console.log("✅ Réponse du serveur :", responseData);
    return responseData;
  } catch (error) {
    console.error("🚨 Erreur sendData :", error);
    return { error: error.message };
  }
};

/**
 * Modifie des données via une requête PUT
 */
export const updateData = async (endpoint, data, token) => {
  return await sendData(endpoint, data, "PUT", token);
};

/* -------------------------------------------------------------------------- */
/*                        🔹 Requêtes DELETE (Supprimer)                      */
/* -------------------------------------------------------------------------- */

/**
 * Supprime une ressource via une requête DELETE
 */
export const deleteData = async (endpoint, token) => {
  try {
    console.log(`🗑 Suppression à : ${API_BASE_URL}/${endpoint}`);

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });

    const checkedResponse = await checkAuth(response);
    if (!checkedResponse) return null;

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("❌ Erreur backend :", errorResponse);
      throw new Error(errorResponse.message || "Erreur lors de la suppression");
    }

    const responseData = await response.json();
    console.log("✅ Réponse du serveur :", responseData);
    return responseData;
  } catch (error) {
    console.error("🚨 Erreur deleteData :", error);
    return { error: error.message };
  }
};
