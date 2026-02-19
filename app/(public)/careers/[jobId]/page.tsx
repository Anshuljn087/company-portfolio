async function getJob(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/${id}`,
    { cache: "no-store" },
  );

  return res.json();
}

export default async function JobDetail({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJob(params.id);

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">{job.title}</h1>

      <p className="mb-10 text-[var(--muted)]">{job.location || "Remote"}</p>

      <div className="prose mb-14">{job.description}</div>

      {/* APPLY FORM */}

      <form
        action="/api/apply-job?redirect=/careers/success"
        method="POST"
        encType="multipart/form-data"
        className="space-y-6 border p-8 rounded-2xl bg-white"
      >
        <input type="hidden" name="jobTitle" value={job.title} />

        <input
          name="name"
          placeholder="Your Name"
          required
          className="w-full p-4 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-4 border rounded-lg"
        />

        <input name="resume" type="file" required className="w-full" />

        <button
          type="submit"
          className="
  px-8 py-4 rounded-xl
  border border-[var(--primary)]
  text-[var(--primary)]
  uppercase font-semibold
  hover:bg-[var(--primary)]
  hover:text-white transition
  disabled:opacity-50
"
        >
          APPLY NOW
        </button>
      </form>
    </main>
  );
}
