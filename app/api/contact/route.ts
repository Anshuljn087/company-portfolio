import { NextResponse } from "next/server";
import {
  getMailConfig,
  isValidEmail,
  limitPublicRequest,
  oneLine,
} from "@/src/lib/mail";

type ContactBody = {
  fullName?: string;
  workEmail?: string;
  companyName?: string;
  currentSituation?: string;
  timeline?: string;
};

export async function POST(req: Request) {
  const limited = limitPublicRequest(req, "contact");
  if (limited) return limited;

  try {
    let body: ContactBody;
    try {
      body = (await req.json()) as ContactBody;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    const fullName = oneLine(body.fullName);
    const workEmail = oneLine(body.workEmail, 254);
    const companyName = oneLine(body.companyName);
    const currentSituation = String(body.currentSituation || "")
      .trim()
      .slice(0, 5000);
    const timeline = oneLine(body.timeline);

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

    const mail = getMailConfig();
    if (!mail) throw new Error("SMTP is not configured");

    await mail.transporter.sendMail({
      from: `"Website Contact" <${mail.user}>`,
      to: mail.to,
      replyTo: workEmail,
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
    return NextResponse.json(
      { success: false, error: "Could not send your message. Please try again later." },
      { status: 500 },
    );
  }
}
