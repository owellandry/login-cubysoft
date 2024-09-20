"use client";

import { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";

export default function Home() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendCode = async () => {
    if (loading || cooldown > 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/request-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStep(2);
        setError(null);
        setCooldown(15);
      } else {
        const data = await response.json();
        setError(data.error || "Error al enviar el código");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        alert("Autenticación exitosa!");
        setStep(1);
        setEmail("");
        setCode("");
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || "Código incorrecto");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="relative w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-lg shadow-2xl transition-transform duration-500 ease-in-out transform hover:scale-105 hover:shadow-blue-500">
        
        {/* Paso 1: Ingresar correo */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-400 animate-pulse">
              Inicia sesión
            </h1>
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
                onClick={handleSendCode}
                disabled={!isEmailValid(email) || loading || cooldown > 0}
                className={`absolute right-2 p-2 rounded-full bg-blue-600 text-white transition-transform duration-300 transform ${
                  !isEmailValid(email) || loading || cooldown > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110 hover:bg-blue-500"
                }`}
              >
                <MdSend size={24} />
              </button>
              {cooldown > 0 && (
                <p className="absolute right-16 text-gray-400">
                  {cooldown}s
                </p>
              )}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}

        {/* Paso 2: Verificar código */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-extrabold mb-6 text-center text-green-400 animate-pulse">
              Ingresa el código
            </h1>
            <p className="text-gray-400 text-center mb-4">
              Hemos enviado un código a: <span className="font-semibold">{email}</span>
            </p>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg shadow-inner focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400 transition duration-300"
                placeholder="Código de verificación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              onClick={handleVerifyCode}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-500 to-green-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
}