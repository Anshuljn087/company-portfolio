import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { sanitizeHtml } from "@/src/lib/sanitizeHtml";
import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";

type BlogDetail = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  authorName?: string;
  readingTime?: number;
  views?: number;
  publishedAt?: string;
  createdAt: string;
};

async function getBlog(slug: string) {
  const headersList = await headers();
  const isBot = /bot|crawl|spider|slurp|preview|facebookexternalhit/i.test(
    headersList.get("user-agent") || "",
  );

  await connectDB();
  const filter = { slug: slug.toLowerCase(), published: true };
  const blog = isBot
    ? await Blog.findOne(filter).lean()
    : await Blog.findOneAndUpdate(filter, { $inc: { views: 1 } }, { new: true }).lean();

  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog)) as BlogDetail;
}

async function getRelatedPosts(slug: string, tags: string[]) {
  await connectDB();
  const query: Record<string, unknown> = {
    published: true,
    slug: { $ne: slug },
  };
  if (tags.length > 0) query.tags = { $in: tags };

  return (await Blog.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean()) as BlogDetail[];
}

function formatDate(dateInput: string | undefined) {
  if (!dateInput) return "";
  return new Date(dateInput).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const blog = await getBlog(slug);
  if (!blog) notFound();

  const safeContent = sanitizeHtml(String(blog.content || ""));
  const tags = (blog.tags || []).slice(0, 8);
  const relatedPosts = await getRelatedPosts(blog.slug, blog.tags || []);

  return (
    <main className="bg-gradient-to-b from-[#F7FAFC] to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] to-[#1B2C3D]" />
        <div className="relative max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-wider text-white/70">
            {blog.category || "Engineering"}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            {blog.title}
          </h1>
          <p className="mt-4 text-white/80 max-w-3xl">{blog.excerpt}</p>
          <p className="mt-6 text-sm text-white/70">
            {blog.authorName || "Gangwal IT Team"} | {blog.readingTime || 1} min
            read | {formatDate(blog.publishedAt || blog.createdAt)} |{" "}
            {blog.views || 0} views
          </p>
        </div>
      </section>

      <article className="max-w-5xl mx-auto px-6 py-12">
        <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-[#D6E0EA] shadow-sm">
          <Image
            src={
              blog.coverImage ||
              "https://images.unsplash.com/photo-1518773553398-650c184e0bb3"
            }
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-[#D6E0EA] px-3 py-1 text-sm text-[#475569] hover:border-[var(--primary)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div
          className="prose max-w-none mt-10 prose-headings:text-[#0F172A] prose-p:text-[#334155] prose-li:text-[#334155]"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </article>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-[var(--primary)] mb-6">
          Related articles
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedPosts.map((item) => (
            <Link
              key={item._id}
              href={`/blog/${encodeURIComponent(item.slug)}`}
              className="rounded-xl border border-[#D6E0EA] bg-white p-5 hover:border-[var(--primary)] transition"
            >
              <p className="text-xs uppercase tracking-wide text-[var(--primary)] font-semibold">
                {item.category || "Engineering"}
              </p>
              <h3 className="mt-2 font-semibold text-[#0F172A]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#64748B] line-clamp-3">
                {item.excerpt}
              </p>
            </Link>
          ))}
          {relatedPosts.length === 0 && (
            <p className="text-sm text-[#64748B]">No related posts available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
