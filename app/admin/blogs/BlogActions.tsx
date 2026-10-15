"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BlogActions({
  slug,
  published,
}: {
  slug: string;
  published: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const url = `/api/blogs/${encodeURIComponent(slug)}`;

  async function call(init: RequestInit, success: string) {
    setBusy(true);
    try {
      const res = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Request failed");
      }
      toast.success(success);
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      <Link
        href={`/admin/blogs/${encodeURIComponent(slug)}/edit`}
        className="rounded border border-[#1E293B] px-3 py-1 hover:border-[var(--primary)]"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          call(
            { method: "PUT", body: JSON.stringify({ published: !published }) },
            published ? "Moved to drafts" : "Published",
          )
        }
        className="rounded border border-[#1E293B] px-3 py-1 hover:border-[var(--primary)] disabled:opacity-60"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (window.confirm("Delete this blog permanently?")) {
            call({ method: "DELETE" }, "Blog deleted");
          }
        }}
        className="rounded border border-red-500 px-3 py-1 text-red-500 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}
