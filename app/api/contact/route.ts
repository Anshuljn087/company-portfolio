import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Message",
      text: `
Email: ${body.email}
Phone: ${body.phone}

Message:
${body.message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("CONTACT ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 },
    );
  }
}
