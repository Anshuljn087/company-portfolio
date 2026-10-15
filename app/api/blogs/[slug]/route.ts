import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { NextResponse } from "next/server";
import { isAdminFromCookies } from "@/src/lib/adminAuth";
import { sanitizeHtml } from "@/src/lib/sanitizeHtml";
import {
  buildExcerpt,
  cleanImageUrl,
  estimateReadingTime,
  normalizeTags,
  slugify,
} from "@/src/lib/blogUtils";

type Ctx = { params: Promise<{ slug: string }> };

// Public read. View counting happens on the page render, not here.
export async function GET(req: Request, context: Ctx) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    await connectDB();

    const blog = await Blog.findOne({ slug: slug.toLowerCase(), published: true });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("BLOG SLUG API ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Admin: partial update (also used to publish/unpublish).
export async function PUT(req: Request, context: Ctx) {
  if (!(await isAdminFromCookies())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  await connectDB();
  const blog = await Blog.findOne({ slug: slug.toLowerCase() });
  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) {
      return NextResponse.json({ message: "Title cannot be empty" }, { status: 400 });
    }
    blog.title = title;
  }

  if (body.slug !== undefined) {
    const newSlug = slugify(String(body.slug));
    if (!newSlug) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
    }
    if (newSlug !== blog.slug && (await Blog.exists({ slug: newSlug }))) {
      return NextResponse.json(
        { message: "A blog with this slug already exists" },
        { status: 409 },
      );
    }
    blog.slug = newSlug;
  }

  if (body.content !== undefined) {
    const content = sanitizeHtml(String(body.content));
    if (!content) {
      return NextResponse.json({ message: "Content cannot be empty" }, { status: 400 });
    }
    blog.content = content;
    blog.readingTime = estimateReadingTime(content);
  }

  if (body.excerpt !== undefined || body.content !== undefined) {
    blog.excerpt = buildExcerpt(
      String(body.excerpt ?? blog.excerpt ?? ""),
      blog.content,
    );
  }
  if (body.coverImage !== undefined) blog.coverImage = cleanImageUrl(body.coverImage);
  if (body.authorName !== undefined) {
    blog.authorName = String(body.authorName).trim() || "Gangwal IT Team";
  }
  if (body.category !== undefined) {
    blog.category = String(body.category).trim() || "Engineering";
  }
  if (body.tags !== undefined) {
    blog.tags = normalizeTags(body.tags as string | string[] | undefined);
  }
  if (body.featured !== undefined) blog.featured = Boolean(body.featured);
  if (body.published !== undefined) {
    const published = Boolean(body.published);
    if (published && !blog.published) blog.publishedAt = new Date();
    blog.published = published;
  }

  try {
    await blog.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json(
        { message: "A blog with this slug already exists" },
        { status: 409 },
      );
    }
    throw err;
  }

  return NextResponse.json(blog);
}

// Admin: delete.
export async function DELETE(req: Request, context: Ctx) {
  if (!(await isAdminFromCookies())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  await connectDB();
  const deleted = await Blog.findOneAndDelete({ slug: slug.toLowerCase() });
  if (!deleted) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
