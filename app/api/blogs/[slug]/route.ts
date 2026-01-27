import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();

  const blog = await Blog.findOne({
    slug: params.slug,
    published: true,
  });

  if (!blog) {
    return NextResponse.json(
      { message: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(blog);
}
