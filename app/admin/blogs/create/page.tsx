"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBlog() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        published: false,
    });

    async function handleSubmit() {
        await fetch("/api/blogs", {
            method: "POST",
            body: JSON.stringify(form),
        });

        router.push("/admin/blogs");
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-20 space-y-4">
            <h1 className="text-2xl font-bold">Create Blog</h1>

            <input
                placeholder="Title"
                className="w-full p-2 border border-[#1E293B] bg-transparent"
                onChange={(e) => {
                    const title = e.target.value;

                    const slug = title
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "");

                    setForm({
                        ...form,
                        title,
                        slug,
                    });
                }}
            />

            <textarea
                placeholder="Content"
                className="w-full h-40 p-2 border border-[#1E293B] bg-transparent"
                onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            <label className="flex gap-2 items-center">
                <input
                    type="checkbox"
                    onChange={(e) =>
                        setForm({ ...form, published: e.target.checked })
                    }
                />
                Publish
            </label>

            <button
                onClick={handleSubmit}
                className="bg-[var(--primary)] px-6 py-2 rounded"
            >
                Save Blog
            </button>
        </div>
    );
}
