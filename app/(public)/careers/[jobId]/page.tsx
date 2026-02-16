"use client";

export default function ApplyPage({ params }: any) {
  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);

    await fetch("/api/apply-job", {
      method: "POST",
      body: formData,
    });

    alert("Application submitted successfully!");
    e.target.reset();
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-6">
        Apply for this Job
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          required
          placeholder="Full Name"
          className="w-full p-3 bg-[#020617] border border-[#1E293B]"
        />

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full p-3 bg-[#020617] border border-[#1E293B]"
        />

        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
        />

        <input
          type="hidden"
          name="jobId"
          value={params.jobId}
        />

        <button className="bg-[var(--primary)] px-4 py-2 rounded text-white">
          Apply Now
        </button>
      </form>
    </section>
  );
}
