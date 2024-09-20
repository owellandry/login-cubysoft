import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, code } = await request.json();
  if (!email || !code) {
    return NextResponse.json({ error: "Correo y código son requeridos" }, { status: 400 });
  }
  globalThis.codes = globalThis.codes || {};
  const storedCodeData = globalThis.codes[email];
  if (!storedCodeData) {
    return NextResponse.json({ error: "Código no solicitado o correo incorrecto" }, { status: 400 });
  }
  if (Date.now() > storedCodeData.expires) {
    return NextResponse.json({ error: "El código ha expirado" }, { status: 400 });
  }
  if (storedCodeData.code !== code) {
    return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
  }
  delete globalThis.codes[email];
  return NextResponse.json({ message: "Autenticación exitosa" }, { status: 200 });
}
