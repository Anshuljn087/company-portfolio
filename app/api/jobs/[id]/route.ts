import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { isValidObjectId } from "mongoose";
import { Job } from "@/src/models/Job";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }

  await connectDB();

  const job = await Job.findOne({ _id: id, isActive: true });

  if (!job) {
    return NextResponse.json(
      { message: "Job not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}