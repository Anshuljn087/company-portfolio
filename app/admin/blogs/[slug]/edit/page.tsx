import { notFound, redirect } from "next/navigation";
import { connectDB } from "@/src/lib/db";
import { Blog } from "@/src/models/Blog";
import { isAdminFromCookies } from "@/src/lib/adminAuth";
import EditBlogForm from "./EditBlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdminFromCookies())) redirect("/admin/login");

  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug: slug.toLowerCase() }).lean<{
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    authorName?: string;
    category?: string;
    tags?: string[];
    featured?: boolean;
    published?: boolean;
  }>();
  if (!blog) notFound();

  return (
    <EditBlogForm
      originalSlug={blog.slug}
      initial={{
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        content: blog.content,
        coverImage: blog.coverImage || "",
        authorName: blog.authorName || "Gangwal IT Team",
        category: blog.category || "Engineering",
        tags: (blog.tags || []).join(", "),
        featured: Boolean(blog.featured),
        published: Boolean(blog.published),
      }}
    />
  );
}
