import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // 🔥 FIX: await params
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findOne({
      slug: slug.toLowerCase(),
      published: true,
    });

    if (!blog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("BLOG SLUG API ERROR:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
