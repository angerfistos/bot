import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { sendData } from "../../services/ApiRequest";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();

  // Soumission du formulaire
  const onSubmit = async (data) => {
    try {
      const response = await sendData("users/register", data);

      if (response.error) {
        alert(response.error); // 🔥 Affiche les erreurs renvoyées par l'API
      } else {
        //alert("Inscription réussie !");
        navigate("/", { replace: true }); // Redirige l'utilisateur vers la page de connexion (replace true = pas d'ajout dans l'url mais remplacement)
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      alert("Une erreur s'est produite.");
    }
  };

  return (
    <div className="dark:bg-gray-900">
      <section className="dark:bg-gray-900 flex items-center justify-center">
        <div className="dark:border dark:bg-gray-800 dark:border-gray-700 w-full max-w-md p-6 bg-white rounded-lg shadow">
          <h1 className="md:text-2xl dark:text-white text-xl font-bold leading-tight tracking-tight text-center text-gray-900">
            Inscription
          </h1>

          {errors.api && <p className="text-sm text-red-500">{errors.api.message}</p>}

          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Nom */}
            <div>
              <label htmlFor="firstName" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Nom
              </label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", { required: "Le nom est obligatoire" })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="lastName" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Prénom
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", { required: "Le prénom est obligatoire" })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone", {
                  required: "Le téléphone est obligatoire",
                  pattern: {
                    value: /^(?:(?:\+|00)(?:32|33)|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
                    message: "Numéro de téléphone invalide",
                  },
                })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "L'email est obligatoire",
                  pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: "Email invalide",
                  },
                })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Le mot de passe est obligatoire",
                  minLength: {
                    value: 6,
                    message: "Le mot de passe doit contenir au moins 6 caractères",
                  },
                })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="dark:text-white block mb-2 text-sm font-medium text-gray-900">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "La confirmation du mot de passe est obligatoire",
                  validate: (value) => value === watch("password") || "Les mots de passe ne correspondent pas",
                })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Bouton d'inscription */}
            <Button text="S'inscrire" type="submit" />

            <p className="dark:text-gray-400 text-sm font-light text-center text-gray-500">
              Déjà un compte ?{" "}
              <Link to="/login" className="hover:underline dark:text-blue-500 font-medium text-blue-600">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;
