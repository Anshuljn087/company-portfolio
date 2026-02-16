import Link from "next/link";

async function getJobs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-[var(--primary)]">
        Careers at Gangwal IT Services
      </h1>

      <div className="space-y-6">
        {jobs.map((job: any) => (
          <div
            key={job._id}
            className="border border-[#1E293B] p-6 rounded"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm text-[var(--muted)] mb-3">
              {job.experience} • {job.location}
            </p>
            <p className="mb-4">{job.description}</p>

            <Link
              href={`/careers/${job._id}`}
              className="text-[var(--primary)] font-medium"
            >
              Apply →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
