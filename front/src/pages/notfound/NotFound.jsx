import { Link } from "react-router-dom";

export default function Example() {
  // Exemple de gestion de l'état de connexion
  const isLoggedIn = false; // Remplacer par un état réel ou logique d'authentification

  return (
    <>
      <main className="place-items-center sm:py-32 lg:px-8 grid min-h-full px-6 py-24 bg-white">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="text-balance sm:text-7xl mt-4 text-5xl font-semibold tracking-tight text-gray-900">
            Page not found
          </h1>
          <p className="text-pretty sm:text-xl/8 mt-6 text-lg font-medium text-gray-500">
            La page que vous cherchez n&apos;existe pas.
          </p>
          <div className="gap-x-6 flex items-center justify-center mt-10">
            <Link
              to={isLoggedIn ? "/dashboard" : "/"} // Lien conditionnel
              className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
