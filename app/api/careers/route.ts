import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ExperiencedPayload = {
  type: "experienced";
  fullName?: string;
  email?: string;
  currentRole?: string;
  yearsOfExperience?: string;
  primaryExpertise?: string;
  projectEndToEnd?: string;
  availability?: string;
  additionalInfo?: string;
};

type InternPayload = {
  type: "intern";
  fullName?: string;
  email?: string;
  currentStatus?: string;
  areaOfInterest?: string;
  whyFullProjects?: string;
  availability?: string;
  optionalWork?: string;
};

type CareersPayload = ExperiencedPayload | InternPayload;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function required(value: string | undefined) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CareersPayload;
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
      auth: { user: smtpUser, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    if (body.type === "experienced") {
      const fullName = required(body.fullName);
      const email = required(body.email);
      const currentRole = required(body.currentRole);
      const yearsOfExperience = required(body.yearsOfExperience);
      const primaryExpertise = required(body.primaryExpertise);
      const projectEndToEnd = required(body.projectEndToEnd);
      const availability = required(body.availability);
      const additionalInfo = required(body.additionalInfo);

      if (
        !fullName ||
        !email ||
        !currentRole ||
        !yearsOfExperience ||
        !primaryExpertise ||
        !projectEndToEnd ||
        !availability
      ) {
        return NextResponse.json(
          { success: false, error: "Please fill all required fields" },
          { status: 400 },
        );
      }

      if (!isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid email" },
          { status: 400 },
        );
      }

      await transporter.sendMail({
        from: `"Careers Portal" <${smtpUser}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "Experienced professional profile submitted",
        text: `Type: Experienced Professional
Full Name: ${fullName}
Email: ${email}
Current Role: ${currentRole}
Years of Experience: ${yearsOfExperience}
Primary Expertise: ${primaryExpertise}
Availability: ${availability}

End-to-end project experience:
${projectEndToEnd}

Anything else relevant:
${additionalInfo || "Not provided"}
`,
      });

      return NextResponse.json({ success: true });
    }

    if (body.type === "intern") {
      const fullName = required(body.fullName);
      const email = required(body.email);
      const currentStatus = required(body.currentStatus);
      const areaOfInterest = required(body.areaOfInterest);
      const whyFullProjects = required(body.whyFullProjects);
      const availability = required(body.availability);
      const optionalWork = required(body.optionalWork);

      if (
        !fullName ||
        !email ||
        !currentStatus ||
        !areaOfInterest ||
        !whyFullProjects ||
        !availability
      ) {
        return NextResponse.json(
          { success: false, error: "Please fill all required fields" },
          { status: 400 },
        );
      }

      if (!isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid email" },
          { status: 400 },
        );
      }

      await transporter.sendMail({
        from: `"Careers Portal" <${smtpUser}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "Intern interest submitted",
        text: `Type: Intern
Full Name: ${fullName}
Email: ${email}
Current Status: ${currentStatus}
Area of Interest: ${areaOfInterest}
Availability: ${availability}

Why full IT projects:
${whyFullProjects}

Built or studied:
${optionalWork || "Not provided"}
`,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid submission type" },
      { status: 400 },
    );
  } catch (err: unknown) {
    console.error("CAREERS API ERROR:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
