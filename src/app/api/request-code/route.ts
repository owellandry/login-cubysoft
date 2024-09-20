import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "El correo es requerido" }, { status: 400 });
    }

    // Generar código de verificación de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Configuración del transporte de nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // TLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Opciones del correo
    const mailOptions = {
        from: 'ChiguiStudio <studio.cubysoft@gmail.com>',
        to: email,
        replyTo: 'studio.cubysoft@gmail.com',
        cc: 'studio.cubysoft@gmail.com',
        bcc: 'studio.cubysoft@gmail.com',
        subject: 'Código de Verificación',
        html: `
        <body style="font-family: Arial, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw;">
            <div style="margin: auto; padding: 0; border-radius: 8px; background: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 100%; max-width: 600px;">

                <!-- Cabecera con logo/banner -->
                <div style="color: white; text-align: center;">
                    <img src="cid:logo@chiguistudio" alt="CubySoft Logo" style="width: 100%; height: auto; border-radius: 0;" draggable="false">
                </div>
                
                <!-- Contenido principal -->
                <div style="padding: 20px; text-align: center;">
                    <h2 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px;">¡Te damos la bienvenida!</h2>
                    <p style="font-size: 16px; color: #555; margin: 10px 0;">Tu código de verificación es:</p>
                    <div style="font-size: 40px; color: #333; padding: 0px 30px; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px 0; letter-spacing: 3px; border: 1px #d7d7d7 solid; box-shadow: 1px 5px 5px 0px gray;">
                        ${verificationCode}
                    </div>
                    <p style="font-size: 16px; color: #e74c3c; margin: 20px 0;">Este código es válido por <strong>5 minutos.</strong><br> Si no solicitaste este código, por favor ignora este mensaje.</p>
                    <a href="https://chiguistudio.com/soporte" style="display: inline-block; text-decoration: none; background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">Contactar Soporte</a>
                    <p style="font-size: 14px; color: #555; margin: 20px 0;">Si tienes problemas con el código, por favor contacta con soporte.</p>
                </div>
                
                <!-- Pie de página -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #aaa; margin: 0;">&copy; ${new Date().getFullYear()} ChiguiStudio. Todos los derechos reservados.</p>
                    <a href="https://chiguistudio.com/terminos" style="font-size: 12px; color: #007bff; text-decoration: none;">Términos y condiciones</a>
                </div>
            </div>
        </body>
        `,
        attachments: [
            {
                filename: 'BannerUp.png',
                path: path.resolve('assets/BannerUp.png'),
                cid: 'logo@chiguistudio',
            }
        ],
    };

    try {
        // Enviar el correo
        await transporter.sendMail(mailOptions);
        console.log(`Código ${verificationCode} enviado al correo ${email}`);

        // Guardar el código temporalmente en memoria global con fecha de expiración
        globalThis.codes = globalThis.codes || {};
        globalThis.codes[email] = { code: verificationCode, expires: Date.now() + 5 * 60 * 1000 };

        return NextResponse.json({ message: "Código enviado correctamente" }, { status: 200 });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return NextResponse.json({ error: "Error al enviar el código al correo" }, { status: 500 });
    }
}
