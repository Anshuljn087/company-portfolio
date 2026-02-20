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
  <main className="bg-gradient-to-b from-white to-gray-50">

    {/* HERO HEADER */}
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">

      <h1 className="text-5xl font-bold text-[var(--primary)]">
        Careers at Gangwal IT Services
      </h1>

      <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
        Work on real production systems with experienced engineers.
        We hire developers who value stability, ownership, and long-term
        engineering growth.
      </p>

    </section>


    {/* JOB LIST */}
    <section className="max-w-6xl mx-auto px-6 pb-24">

      {jobs.length === 0 && (

        <div className="
          text-center bg-white rounded-2xl border p-12 shadow-sm
        ">
          <p className="text-gray-600 text-lg">
            No open roles currently.
          </p>
        </div>

      )}

      <div className="grid gap-8 md:grid-cols-2">

        {jobs.map((job: any) => (

          <Link key={job._id} href={`/careers/${job._id}`}>

            <div className="
              group relative overflow-hidden
              p-10 rounded-3xl
              border border-gray-200
              bg-white
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition duration-300
              cursor-pointer
            ">

              {/* subtle gradient highlight */}
              <div className="
                absolute inset-0 opacity-0
                group-hover:opacity-100
                transition
                bg-gradient-to-br from-[var(--primary)]/5 to-transparent
              " />

              <div className="relative z-10">

                <h2 className="text-2xl font-semibold tracking-tight">
                  {job.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {job.location || "Remote"}
                </p>

                {/* premium apply indicator */}
                <div className="mt-6 flex items-center justify-between">

                  <span className="text-sm text-gray-400">
                    Click to view details
                  </span>

                  <span className="
                    text-[var(--primary)]
                    font-semibold
                    group-hover:translate-x-1
                    transition
                  ">
                    Apply →
                  </span>

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>

  </main>
);
}
