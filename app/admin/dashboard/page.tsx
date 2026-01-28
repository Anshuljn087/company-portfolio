export default function AdminDashboard() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

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
