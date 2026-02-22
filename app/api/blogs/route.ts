import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { NextResponse } from "next/server";
import { isAdminFromCookies } from "@/src/lib/adminAuth";
import { sanitizeHtml } from "@/src/lib/sanitizeHtml";
import {
  buildExcerpt,
  estimateReadingTime,
  normalizeTags,
  slugify,
} from "@/src/lib/blogUtils";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") || "").trim();
  const tag = String(url.searchParams.get("tag") || "").trim().toLowerCase();
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(
    30,
    Math.max(1, Number(url.searchParams.get("limit") || "9")),
  );

  const query: Record<string, unknown> = { published: true };

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }

  if (tag) {
    query.tags = tag;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Blog.find(query)
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(query),
  ]);

  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

export async function POST(req: Request) {
  const authenticated = await isAdminFromCookies();
  if (!authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const cleanTitle = String(body.title || "").trim();
  const cleanContent = sanitizeHtml(String(body.content || ""));
  const cleanSlug = slugify(String(body.slug || cleanTitle));
  const cleanExcerpt = buildExcerpt(String(body.excerpt || ""), cleanContent);
  const cleanTags = normalizeTags(body.tags);
  const published = Boolean(body.published);

  if (!cleanTitle || !cleanSlug || !cleanContent) {
    return NextResponse.json(
      { message: "Title, slug and content are required" },
      { status: 400 },
    );
  }

  const blog = await Blog.create({
    title: cleanTitle,
    slug: cleanSlug,
    excerpt: cleanExcerpt,
    content: cleanContent,
    coverImage: String(body.coverImage || "").trim(),
    authorName: String(body.authorName || "Gangwal IT Team").trim(),
    category: String(body.category || "Engineering").trim(),
    tags: cleanTags,
    readingTime: estimateReadingTime(cleanContent),
    featured: Boolean(body.featured),
    published,
    publishedAt: published ? new Date() : undefined,
  });

  return NextResponse.json(blog, { status: 201 });
}
