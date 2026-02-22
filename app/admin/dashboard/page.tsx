import { redirect } from "next/navigation";
import { isAdminFromCookies } from "@/src/lib/adminAuth";

export default async function AdminDashboard() {
  const authenticated = await isAdminFromCookies();
  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="rounded border border-[#1E293B] px-4 py-2 hover:border-[var(--primary)]"
          >
            Logout
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <a
          href="/admin/blogs"
          className="border border-[#1E293B] p-6 rounded-lg hover:border-[var(--primary)]"
        >
          Manage Blogs
        </a>
      </div>
    </section>
  );
}
