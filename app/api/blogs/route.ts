import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { NextResponse } from "next/server";
import { isAdminFromCookies } from "@/src/lib/adminAuth";
import { sanitizeHtml } from "@/src/lib/sanitizeHtml";
import {
  buildExcerpt,
  estimateReadingTime,
  cleanImageUrl,
  escapeRegex,
  normalizeTags,
  toPositiveInt,
  slugify,
} from "@/src/lib/blogUtils";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") || "").trim();
  const tag = String(url.searchParams.get("tag") || "").trim().toLowerCase();
  const page = toPositiveInt(url.searchParams.get("page"), 1);
  const limit = Math.min(30, toPositiveInt(url.searchParams.get("limit"), 9));

  const query: Record<string, unknown> = { published: true };

  if (q) {
    const pattern = escapeRegex(q.slice(0, 100));
    query.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { excerpt: { $regex: pattern, $options: "i" } },
      { category: { $regex: pattern, $options: "i" } },
      { tags: { $regex: pattern, $options: "i" } },
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const cleanTitle = String(body.title || "").trim();
  const cleanContent = sanitizeHtml(String(body.content || ""));
  const cleanSlug = slugify(String(body.slug || cleanTitle));
  const cleanExcerpt = buildExcerpt(String(body.excerpt || ""), cleanContent);
  const cleanTags = normalizeTags(body.tags as string | string[] | undefined);
  const published = Boolean(body.published);

  if (!cleanTitle || !cleanSlug || !cleanContent) {
    return NextResponse.json(
      { message: "Title, slug and content are required" },
      { status: 400 },
    );
  }

  await connectDB();

  if (await Blog.exists({ slug: cleanSlug })) {
    return NextResponse.json(
      { message: "A blog with this slug already exists" },
      { status: 409 },
    );
  }

  let blog;
  try {
    blog = await Blog.create({
      title: cleanTitle,
      slug: cleanSlug,
      excerpt: cleanExcerpt,
      content: cleanContent,
      coverImage: cleanImageUrl(body.coverImage),
      authorName: String(body.authorName || "Gangwal IT Team").trim(),
      category: String(body.category || "Engineering").trim(),
      tags: cleanTags,
      readingTime: estimateReadingTime(cleanContent),
      featured: Boolean(body.featured),
      published,
      publishedAt: published ? new Date() : undefined,
    });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json(
        { message: "A blog with this slug already exists" },
        { status: 409 },
      );
    }
    throw err;
  }

  return NextResponse.json(blog, { status: 201 });
}
