const Button = ({ text, onClick, className, type = "button" }) => {
  return (
    <button
      type={type} // Le type peut être "button", "submit", ou "reset"
      onClick={onClick} // Fonction pour le clic
      className={`
        w-full 
        text-white 
        bg-green-600 
        hover:bg-green-700 
        focus:ring-4 
        focus:outline-none 
        focus:ring-blue-300 
        font-medium rounded-lg 
        text-sm px-5 
        py-2.5 
        ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
