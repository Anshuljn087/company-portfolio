import Link from "next/link";
import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { redirect } from "next/navigation";
import { isAdminFromCookies } from "@/src/lib/adminAuth";
import BlogActions from "./BlogActions";

type AdminBlog = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  readingTime?: number;
  views?: number;
  featured?: boolean;
  publishedAt?: string;
  createdAt: string;
  published: boolean;
};

async function getBlogs() {
  await connectDB();
  return (await Blog.find().sort({ createdAt: -1 }).lean()) as AdminBlog[];
}

export default async function AdminBlogs() {
  const authenticated = await isAdminFromCookies();
  if (!authenticated) {
    redirect("/admin/login");
  }

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
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-[#1E293B] p-4 rounded"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{blog.title}</p>
              <div className="flex items-center gap-2 text-xs">
                {blog.featured && (
                  <span className="rounded-full border border-[var(--primary)] px-2 py-1 text-[var(--primary)]">
                    Featured
                  </span>
                )}
                <span className="text-[var(--muted)]">
                  {blog.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">/{blog.slug}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {blog.category || "Engineering"} | {blog.readingTime || 1} min read
              | {blog.views || 0} views
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
            </p>
            <BlogActions slug={blog.slug} published={blog.published} />
          </div>
        ))}
      </div>
    </section>
  );
}
