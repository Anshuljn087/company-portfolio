import { headers } from "next/headers";

type JobDetail = {
  _id: string;
  title: string;
  location?: string;
  description?: string;
};

async function getJob(id: string) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/jobs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;

  return (await res.json()) as JobDetail;
}

export default async function JobDetail({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  if (!job) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-[var(--muted)]">Job not found.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">{job.title}</h1>

      <p className="mb-10 text-[var(--muted)]">{job.location || "Remote"}</p>

      <div className="prose mb-14">{job.description || ""}</div>

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
