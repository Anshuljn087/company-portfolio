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

  await connectDB();
  const data = await req.json();
  const job = await Job.create(data);
  return NextResponse.json(job, { status: 201 });
}
