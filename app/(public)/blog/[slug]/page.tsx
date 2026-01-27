import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getBlog(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found | YourCompany",
    };
  }

  return {
    title: `${blog.title} | YourCompany`,
    description: blog.excerpt || "Blog article",
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-[var(--primary)] mb-4">
        {blog.title}
      </h1>

      <p className="text-[var(--muted)] mb-10">
        {new Date(blog.createdAt).toDateString()}
      </p>

      <div className="prose prose-invert max-w-none">
        {blog.content}
      </div>
    </article>
  );
}
