"use client";

import { useState } from "react";
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

const inputClass = "w-full p-3 border border-[#1E293B] rounded bg-transparent";

export default function EditBlogForm({
  originalSlug,
  initial,
}: {
  originalSlug: string;
  initial: BlogForm;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BlogForm>(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof BlogForm>(key: K, value: BlogForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(originalSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to save blog");

      toast.success("Blog updated");
      router.push("/admin/blogs");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-5">
      <h1 className="text-3xl font-bold text-[var(--primary)]">Edit Blog</h1>

      <input placeholder="Title" className={inputClass} value={form.title}
        onChange={(e) => set("title", e.target.value)} />
      <input placeholder="Slug" className={inputClass} value={form.slug}
        onChange={(e) => set("slug", e.target.value)} />
      <textarea placeholder="Excerpt" rows={3} className={inputClass} value={form.excerpt}
        onChange={(e) => set("excerpt", e.target.value)} />
      <textarea placeholder="Content (HTML supported)" rows={12} className={inputClass}
        value={form.content} onChange={(e) => set("content", e.target.value)} />

      <div className="grid md:grid-cols-2 gap-4">
        <input placeholder="Cover Image URL" className={inputClass} value={form.coverImage}
          onChange={(e) => set("coverImage", e.target.value)} />
        <input placeholder="Author Name" className={inputClass} value={form.authorName}
          onChange={(e) => set("authorName", e.target.value)} />
        <input placeholder="Category" className={inputClass} value={form.category}
          onChange={(e) => set("category", e.target.value)} />
        <input placeholder="Tags (comma separated)" className={inputClass} value={form.tags}
          onChange={(e) => set("tags", e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={form.published}
            onChange={(e) => set("published", e.target.checked)} />
          Published
        </label>
      </div>

      <button onClick={handleSubmit} disabled={saving}
        className="bg-[var(--primary)] text-white px-6 py-3 rounded disabled:opacity-60">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
