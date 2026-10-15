import { NextResponse } from "next/server";
import {
  getMailConfig,
  isValidEmail,
  limitPublicRequest,
  oneLine,
} from "@/src/lib/mail";

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

function required(value: string | undefined) {
  return oneLine(value);
}

function longText(value: string | undefined) {
  return String(value || "").trim().slice(0, 5000);
}

export async function POST(req: Request) {
  try {
    const limited = await limitPublicRequest(req, "careers");
    if (limited) return limited;

    let body: CareersPayload;
    try {
      body = (await req.json()) as CareersPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    const mail = getMailConfig();
    if (!mail) throw new Error("SMTP is not configured");
    const { transporter, user: smtpUser, to: adminEmail } = mail;

    if (body.type === "experienced") {
      const fullName = required(body.fullName);
      const email = required(body.email);
      const currentRole = required(body.currentRole);
      const yearsOfExperience = required(body.yearsOfExperience);
      const primaryExpertise = required(body.primaryExpertise);
      const projectEndToEnd = longText(body.projectEndToEnd);
      const availability = required(body.availability);
      const additionalInfo = longText(body.additionalInfo);

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
        to: adminEmail,
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
      const whyFullProjects = longText(body.whyFullProjects);
      const availability = required(body.availability);
      const optionalWork = longText(body.optionalWork);

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
        to: adminEmail,
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
    return NextResponse.json(
      { success: false, error: "Could not submit your application. Please try again later." },
      { status: 500 },
    );
  }
}
