import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Job } from "@/src/models/Job";

export async function GET() {
  await connectDB();
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const job = await Job.create(data);
  return NextResponse.json(job, { status: 201 });
}
