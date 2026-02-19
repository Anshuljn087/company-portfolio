import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { Job } from "@/src/models/Job";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  const job = await Job.findById(id);

  if (!job) {
    return NextResponse.json(
      { message: "Job not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}