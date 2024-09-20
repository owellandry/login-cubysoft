// app/doc/page.tsx

import React from "react";

const DocPage = () => {
  return (
    <div className="p-8 bg-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-4">Documentación de la API</h1>
      <h2 className="text-2xl mb-2">Obtención del Código de Verificación</h2>
      <p>
        Para obtener un código de verificación, se debe realizar una solicitud POST a la siguiente ruta:
      </p>
      <pre className="bg-gray-900 p-4 rounded-lg mt-4">
        <code>
          POST /api/request-code
          {"\n"}{"\n"}
          {`{
  "email": "tu_correo@ejemplo.com"
}`}
        </code>
      </pre>
      <p className="mt-4">
        La respuesta será un código de estado 200 si se envía el código correctamente. Si hay un error, se devolverá un mensaje de error correspondiente.
      </p>
    </div>
  );
};

export default DocPage;
