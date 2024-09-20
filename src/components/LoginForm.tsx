import React from "react";
import { MdSend } from "react-icons/md";

interface LoginFormProps {
  onSendCode: () => void;
  loading: boolean;
  cooldown: number;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  isEmailValid: (email: string) => boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSendCode, loading, cooldown, email, setEmail, error, isEmailValid }) => {
  return (
    <>
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-400 animate-pulse">Inicia sesión</h1>
      <div className="relative flex items-center">
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg shadow-inner focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-300"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          onClick={onSendCode}
          disabled={!isEmailValid(email) || loading || cooldown > 0}
          className={`absolute right-2 p-2 rounded-full bg-blue-600 text-white transition-transform duration-300 transform ${
            !isEmailValid(email) || loading || cooldown > 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110 hover:bg-blue-500"
          }`}
        >
          <MdSend size={24} />
        </button>
        {cooldown > 0 && <p className="absolute right-16 text-gray-400">{cooldown}s</p>}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </>
  );
};

export default LoginForm;
