import { useState, useEffect } from "react";

const Header = () => {
  const text = "Bot WhatsApp";
  const [displayedText, setDisplayedText] = useState(text);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000); // Effet glitch toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-col items-center p-4 text-white bg-gray-800">
      <h1
        className={`text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent ${
          glitch ? "glitch-effect" : ""
        }`}
      >
        {displayedText}
      </h1>

      <style>
        {`
          @keyframes glitch {
            0% { transform: skewX(0deg); opacity: 1; }
            20% { transform: skewX(10deg); opacity: 0.8; }
            40% { transform: skewX(-10deg); opacity: 1; }
            60% { transform: skewX(5deg); opacity: 0.8; }
            80% { transform: skewX(-5deg); opacity: 1; }
            100% { transform: skewX(0deg); opacity: 1; }
          }
          .glitch-effect {
            animation: glitch 0.15s ease-in-out;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
