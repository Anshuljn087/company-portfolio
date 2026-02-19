import { connectDB } from "@/src/lib/db";
import { Job } from "@/src/models/Job";
import { NextResponse } from "next/server";

export async function GET(
  req:Request,
  {params}:{params:{id:string}}
){

  await connectDB();

  const job = await Job.findById(params.id);

  return NextResponse.json(job);
}