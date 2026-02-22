import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactBody = {
  fullName?: string;
  workEmail?: string;
  companyName?: string;
  currentSituation?: string;
  timeline?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactBody;

    const fullName = String(body.fullName || "").trim();
    const workEmail = String(body.workEmail || "").trim();
    const companyName = String(body.companyName || "").trim();
    const currentSituation = String(body.currentSituation || "").trim();
    const timeline = String(body.timeline || "").trim();

    if (!fullName || !workEmail || !companyName || !currentSituation) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields" },
        { status: 400 },
      );
    }

    if (!isValidEmail(workEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid work email" },
        { status: 400 },
      );
    }

    const smtpUser = process.env.SMTP_USER || process.env.SMTP_EMAIL;
    if (
      !smtpUser ||
      !process.env.SMTP_PASS ||
      !process.env.SMTP_HOST ||
      !process.env.ADMIN_EMAIL
    ) {
      throw new Error("SMTP is not configured");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: smtpUser,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${smtpUser}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Start with a conversation - New contact request",
      text: `Full Name: ${fullName}
Work Email: ${workEmail}
Company Name: ${companyName}
Timeline: ${timeline || "Not specified"}

Current situation:
${currentSituation}
`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("CONTACT ERROR:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
