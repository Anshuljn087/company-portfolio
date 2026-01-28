import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const blogs = await Blog.find({ published: true }).sort({
    createdAt: -1,
  });

  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const blog = await Blog.create({
    ...body,
    slug: body.slug.toLowerCase(),
  });
  return NextResponse.json(blog, { status: 201 });
}
