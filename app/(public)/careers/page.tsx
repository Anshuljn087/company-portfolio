import { headers } from "next/headers";
import Link from "next/link";

async function getJobs() {
  const headersList = await headers();

  const host = headersList.get("host");

  if (!host) return null;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/jobs`;

  const res = await fetch(url, { cache: "no-store" });

  return res.json();
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12 text-[var(--primary)]">
        Careers at Gangwal IT Services
      </h1>

      {jobs.length === 0 && <p>No open roles currently.</p>}

      <div className="grid gap-8">
        {jobs.map((job: any) => (
          <Link key={job._id} href={`/careers/${job._id}`}>
            <div
              className="
              p-8 rounded-2xl
              border border-[#D5E2EC]
              hover:border-[var(--primary)]
              transition cursor-pointer
              bg-white
              shadow-sm hover:shadow-lg
            "
            >
              <h2 className="text-2xl font-semibold">{job.title}</h2>

              <p className="text-[var(--muted)] mt-2">
                {job.location || "Remote"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
