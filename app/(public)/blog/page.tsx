import Link from "next/link";
import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";

async function getBlogs() {
    await connectDB();

    return Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .lean();
}

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-[var(--primary)] mb-10">
                Blog
            </h1>

            {blogs.length === 0 && (
                <p className="text-[var(--muted)]">
                    No blogs published yet.
                </p>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {blogs.map((blog: any) => (
                    <Link
                        key={blog._id}
                        href={`/blog/${encodeURIComponent(blog.slug)}`}
                        className="border border-[#1E293B] rounded-lg p-6 hover:border-[var(--primary)] transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            {blog.title}
                        </h2>
                        <p className="text-[var(--muted)]">
                            {blog.excerpt}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
