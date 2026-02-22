import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";

type BlogItem = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  authorName?: string;
  readingTime?: number;
  publishedAt?: string;
  createdAt: string;
  featured?: boolean;
};

async function getBlogs(q: string, tag: string, page: number, limit: number) {
  await connectDB();

  const query: Record<string, unknown> = { published: true };
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }
  if (tag) query.tags = tag.toLowerCase();

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Blog.find(query)
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs: items as BlogItem[],
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function formatDate(dateInput: string | undefined) {
  if (!dateInput) return "";
  return new Date(dateInput).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = String(params.q || "").trim();
  const tag = String(params.tag || "").trim();
  const page = Math.max(1, Number(params.page || "1"));
  const limit = 9;

  const { blogs, totalPages } = await getBlogs(q, tag, page, limit);
  const featured = blogs.find((blog) => blog.featured) || blogs[0];
  const allTags = Array.from(
    new Set(
      blogs.flatMap((blog) => blog.tags || []).map((item) => item.toLowerCase()),
    ),
  ).slice(0, 10);

  return (
    <main className="bg-gradient-to-b from-[#F7FAFC] to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] to-[#1B2C3D]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-bold text-white">Engineering Insights</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Practical notes on building, improving, and supporting real software
            systems.
          </p>

          <form className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by topic, tag, or title"
              className="flex-1 rounded-lg border border-white/20 bg-white/90 p-3 text-[#0B1220]"
            />
            {tag && <input type="hidden" name="tag" value={tag} />}
            <button className="rounded-lg bg-[var(--primary)] px-6 py-3 text-white font-semibold">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-2 text-sm border ${
              !tag ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[#CBD5E1] text-[#334155]"
            }`}
          >
            All topics
          </Link>
          {allTags.map((item) => (
            <Link
              key={item}
              href={`/blog?tag=${encodeURIComponent(item)}`}
              className={`rounded-full px-4 py-2 text-sm border ${
                tag === item
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[#CBD5E1] text-[#334155]"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </section>

      {featured && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <Link
            href={`/blog/${encodeURIComponent(featured.slug)}`}
            className="grid lg:grid-cols-2 overflow-hidden rounded-2xl border border-[#D6E0EA] bg-white shadow-sm hover:shadow-xl transition"
          >
            <div className="relative min-h-[260px]">
              <Image
                src={
                  featured.coverImage ||
                  "https://images.unsplash.com/photo-1518773553398-650c184e0bb3"
                }
                alt={featured.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-semibold">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">
                {featured.title}
              </h2>
              <p className="mt-4 text-[#475569]">{featured.excerpt}</p>
              <p className="mt-6 text-sm text-[#64748B]">
                {featured.authorName || "Gangwal IT Team"} |{" "}
                {featured.readingTime || 1} min read |{" "}
                {formatDate(featured.publishedAt || featured.createdAt)}
              </p>
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 pb-16">
        {blogs.length === 0 ? (
          <p className="text-[var(--muted)]">No blogs found for this filter.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${encodeURIComponent(blog.slug)}`}
                className="rounded-xl border border-[#D6E0EA] bg-white p-5 hover:border-[var(--primary)] transition"
              >
                <p className="text-xs uppercase tracking-wide text-[var(--primary)] font-semibold">
                  {blog.category || "Engineering"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">
                  {blog.title}
                </h3>
                <p className="mt-3 text-[#64748B] text-sm">{blog.excerpt}</p>
                <p className="mt-4 text-xs text-[#94A3B8]">
                  {blog.readingTime || 1} min read
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between">
          <Link
            href={`/blog?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
            className={`px-4 py-2 rounded border ${
              page <= 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Previous
          </Link>
          <p className="text-sm text-[#64748B]">
            Page {page} of {totalPages}
          </p>
          <Link
            href={`/blog?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
            className={`px-4 py-2 rounded border ${
              page >= totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Next
          </Link>
        </div>
      </section>
    </main>
  );
}
