import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("resume") as File;

  if (!file) {
    return NextResponse.json({ error: "Resume is required" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: "Resume must be under 5MB" },
      { status: 400 },
    );
  }

  if (file.type !== "application/pdf" && !file.type.includes("word")) {
    return NextResponse.json(
      { error: "Only PDF or Word allowed" },
      { status: 400 },
    );
  }

  const smtpUser = process.env.SMTP_USER || process.env.SMTP_EMAIL;
  if (!smtpUser || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
    return NextResponse.json(
      { error: "SMTP is not configured" },
      { status: 500 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: smtpUser,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Careers | Gangwal IT Services" <${smtpUser}>`,
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
