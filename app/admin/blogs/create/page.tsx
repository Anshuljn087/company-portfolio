"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  category: string;
  tags: string;
  featured: boolean;
  published: boolean;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CreateBlog() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "Gangwal IT Team",
    category: "Engineering",
    tags: "",
    featured: false,
    published: false,
  });

  useEffect(() => {
    async function checkSession() {
      let authenticated = false;
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        authenticated = Boolean((await res.json()).authenticated);
      } catch {
        authenticated = false;
      }

      if (!authenticated) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkSession();
  }, [router]);

  const estimatedReadTime = useMemo(() => {
    const words = form.content
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }, [form.content]);

  async function handleSubmit() {
    setSaving(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to save blog");
      }

      toast.success("Blog saved");
      router.push("/admin/blogs");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save blog";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (checkingAuth) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--primary)]">Create Blog</h1>
        <p className="text-sm text-[var(--muted)]">~ {estimatedReadTime} min read</p>
      </div>

      <input
        placeholder="Title"
        className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
        value={form.title}
        onChange={(e) => {
          const title = e.target.value;
          setForm((prev) => ({ ...prev, title, slug: slugify(title) }));
        }}
      />

      <input
        placeholder="Slug"
        className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
        value={form.slug}
        onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
      />

      <textarea
        placeholder="Excerpt"
        rows={3}
        className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
        value={form.excerpt}
        onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
      />

      <textarea
        placeholder="Content (HTML supported)"
        rows={12}
        className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
        value={form.content}
        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Cover Image URL"
          className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
          value={form.coverImage}
          onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
        />

        <input
          placeholder="Author Name"
          className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
          value={form.authorName}
          onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
        />

        <input
          placeholder="Category"
          className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
        />

        <input
          placeholder="Tags (comma separated)"
          className="w-full p-3 border border-[#1E293B] rounded bg-transparent"
          value={form.tags}
          onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
        />
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, featured: e.target.checked }))
            }
          />
          Featured
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, published: e.target.checked }))
            }
          />
          Publish now
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-[var(--primary)] text-white px-6 py-3 rounded disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Blog"}
      </button>
    </div>
  );
}
