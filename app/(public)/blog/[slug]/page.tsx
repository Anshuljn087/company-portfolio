import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getBlog(slug: string) {
  const headersList = await headers();

  const host = headersList.get("host");

  if (!host) return null;

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const url = `${protocol}://${host}/api/blogs/${slug}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return null;
  return res.json();
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

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-[var(--primary)] mb-4">
        {blog.title}
      </h1>

      <p className="text-[var(--muted)] mb-10">
        {blog.createdAt
          ? new Date(blog.createdAt).toDateString()
          : ""}
      </p>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}

