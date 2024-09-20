"use client";

import { useState, useEffect, useRef } from "react";
import LoginForm from "@/components/LoginForm";
import VerificationForm from "@/components/VerificationForm";
import FloatingDocButton from "@/components/FloatingDocButton";
import Notification from "@/components/Notification";
import { MdSend } from "react-icons/md";

export default function Home() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [animateStep, setAnimateStep] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        setAnimateStep(true);
        setTimeout(() => {
          setStep(2);
          setAnimateStep(false);
          setCooldown(15);
        }, 300);
      } else {
        const data = await response.json();
        setError(data.error || "Error al enviar el código");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (loading) return;

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
        setNotification("El código se ha enviado nuevamente.");
        setTimeout(() => setNotification(null), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Error al enviar el código");
        setNotification(data.error || "Error al enviar el código.");
      }
    } catch {
      setError("Error al conectar con el servidor");
      setNotification("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
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
      <div
        className={`relative w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-lg shadow-2xl transform transition-all duration-500 ease-in-out ${
          animateStep ? "opacity-0 -translate-x-10" : "opacity-100 translate-x-0"
        }`}
      >
        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}
        {step === 1 ? (
          <LoginForm 
            onSendCode={handleSendCode}
            loading={loading}
            cooldown={cooldown}
            email={email}
            setEmail={setEmail}
            error={error}
            isEmailValid={isEmailValid}
          />
        ) : (
          <>
            <VerificationForm 
              onVerifyCode={handleVerifyCode}
              loading={loading}
              code={code}
              setCode={setCode}
              email={email}
              inputsRef={inputsRef}
            />
            <button
              className="w-full py-3 mt-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              onClick={handleResendCode}
            >
              Solicitar nuevo código
            </button>
          </>
        )}
      </div>

      <FloatingDocButton />

      {notification && (
        <Notification 
          message={notification} 
          onClose={() => setNotification(null)} 
        />
      )}

      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-500 to-green-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
}
