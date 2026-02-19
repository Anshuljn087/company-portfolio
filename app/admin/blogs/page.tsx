import Link from "next/link";

async function getBlogs() {
  const res = await fetch("/api/blogs", {
    cache: "no-store",
  });
  return res.json();
}

export default async function AdminBlogs() {
  const blogs = await getBlogs();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link
          href="/admin/blogs/create"
          className="bg-[var(--primary)] px-4 py-2 rounded"
        >
          + New Blog
        </Link>
      </div>

      <div className="space-y-4">
        {blogs.map((blog: any) => (
          <div
            key={blog._id}
            className="border border-[#1E293B] p-4 rounded"
          >
            <p className="font-semibold">{blog.title}</p>
            <p className="text-xs text-[var(--muted)]">
              {blog.published ? "Published" : "Draft"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
