import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Job } from "@/src/models/Job";
import { isAdminFromCookies } from "@/src/lib/adminAuth";

export async function GET() {
  await connectDB();
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const authenticated = await isAdminFromCookies();
  if (!authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const title = String(data.title || "").trim();
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  await connectDB();
  const job = await Job.create({
    title,
    location: String(data.location || "").trim(),
    experience: String(data.experience || "").trim(),
    description: String(data.description || "").trim(),
    isActive: data.isActive === undefined ? true : Boolean(data.isActive),
  });
  return NextResponse.json(job, { status: 201 });
}
