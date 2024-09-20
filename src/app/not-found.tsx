// src/app/not-found.tsx

"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Redirigir a la página de inicio después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center space-y-6 p-6">
      <div className="relative">
        <h1 className="text-8xl font-extrabold mb-4 animate-bounce">
          404
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          ¡Oops! No pudimos encontrar la página que estás buscando.
        </p>
      </div>

      {/* Botón con animación y hover */}
      <button
        onClick={() => router.push("/")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center justify-center px-6 py-3 bg-blue-600 text-lg font-medium text-white rounded-full transition-transform duration-300 ease-in-out transform ${
          hovered ? "scale-105" : "scale-100"
        } hover:shadow-xl hover:bg-blue-500`}
      >
        <FaHome className="mr-2" />
        Ir a Inicio
      </button>

      {/* Barra de progreso para la redirección automática */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-progress"></div>
      </div>
      <p className="text-sm text-gray-500">
        Serás redirigido a la página de inicio en 10 segundos...
      </p>

      {/* Elementos decorativos en el fondo */}
      <div className="absolute w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-3xl rounded-full top-10 animate-pulse"></div>
      <div className="absolute w-48 h-48 bg-gradient-to-r from-yellow-500 to-red-500 opacity-20 blur-2xl rounded-full bottom-10 right-10 animate-pulse"></div>
    </div>
  );
}
