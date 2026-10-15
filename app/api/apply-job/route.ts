import { NextResponse } from "next/server";
import {
  getMailConfig,
  isValidEmail,
  limitPublicRequest,
  oneLine,
} from "@/src/lib/mail";

const MAX_BYTES = 5 * 1024 * 1024;

function detectResume(buf: Buffer) {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") {
    return { ext: "pdf", type: "application/pdf" };
  }
  // .docx (zip container)
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    return {
      ext: "docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }
  // legacy .doc (OLE2)
  if (
    buf.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
  ) {
    return { ext: "doc", type: "application/msword" };
  }
  return null;
}

export async function POST(req: Request) {
  const limited = limitPublicRequest(req, "apply-job");
  if (limited) return limited;

  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Resume must be under 5MB" }, { status: 400 });
    }

    const name = oneLine(formData.get("name"));
    const email = oneLine(formData.get("email"), 254);
    const jobId = oneLine(formData.get("jobId"), 64);

    if (!name || !email || !jobId) {
      return NextResponse.json(
        { error: "Name, email and job are required" },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = detectResume(buffer);
    if (!detected) {
      return NextResponse.json({ error: "Only PDF or Word allowed" }, { status: 400 });
    }

    const mail = getMailConfig();
    if (!mail) {
      console.error("APPLY JOB ERROR: SMTP is not configured");
      return NextResponse.json({ error: "Could not submit application" }, { status: 500 });
    }

    const safeBase =
      file.name.replace(/\.[^.]*$/, "").replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 60) ||
      "resume";

    await mail.transporter.sendMail({
      from: `"Careers | Gangwal IT Services" <${mail.user}>`,
      to: mail.to,
      replyTo: email,
      subject: "New Job Application Received",
      text: `Name: ${name}\nEmail: ${email}\nJob ID: ${jobId}\n`,
      attachments: [
        {
          filename: `${safeBase}.${detected.ext}`,
          content: buffer,
          contentType: detected.type,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("APPLY JOB ERROR:", err);
    return NextResponse.json({ error: "Could not submit application" }, { status: 500 });
  }
}
