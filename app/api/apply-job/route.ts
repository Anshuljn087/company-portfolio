import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("resume") as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Careers | Gangwal IT Services" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Job Application Received",
    text: `
Name: ${formData.get("name")}
Email: ${formData.get("email")}
Job ID: ${formData.get("jobId")}
    `,
    attachments: [
      {
        filename: file.name,
        content: buffer,
      },
    ],
  });

  return NextResponse.json({ success: true });
}
