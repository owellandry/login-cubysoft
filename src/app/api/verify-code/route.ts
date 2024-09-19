import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, code } = await request.json();

  // Verifica que el correo y el código hayan sido proporcionados
  if (!email || !code) {
    return NextResponse.json({ error: "Correo y código son requeridos" }, { status: 400 });
  }

  // Verifica si el código está almacenado para el correo
  globalThis.codes = globalThis.codes || {};
  const storedCodeData = globalThis.codes[email];

  if (!storedCodeData) {
    return NextResponse.json({ error: "Código no solicitado o correo incorrecto" }, { status: 400 });
  }

  // Verifica si el código ha expirado
  if (Date.now() > storedCodeData.expires) {
    return NextResponse.json({ error: "El código ha expirado" }, { status: 400 });
  }

  // Verifica si el código coincide
  if (storedCodeData.code !== code) {
    return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
  }

  // Si el código es válido, devuelve éxito (aquí puedes manejar el login o la creación de cuenta)
  // Remueve el código después de verificar
  delete globalThis.codes[email];

  return NextResponse.json({ message: "Autenticación exitosa" }, { status: 200 });
}
