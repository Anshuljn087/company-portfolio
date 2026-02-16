"use client";

export default function NewJobPage() {
  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    window.location.href = "/admin/jobs";
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-6">Add Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Job Title" required className="w-full p-3 bg-[#020617] border border-[#1E293B]" />
        <input name="location" placeholder="Location / Remote" required className="w-full p-3 bg-[#020617] border border-[#1E293B]" />
        <input name="experience" placeholder="Experience (e.g. 2–4 years)" required className="w-full p-3 bg-[#020617] border border-[#1E293B]" />
        <textarea name="description" placeholder="Job Description" required className="w-full p-3 bg-[#020617] border border-[#1E293B]" />

        <button className="bg-[var(--primary)] px-4 py-2 rounded text-white">
          Create Job
        </button>
      </form>
    </section>
  );
}
