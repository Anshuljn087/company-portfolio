import Link from "next/link";

export default function Home() {
  return (
    <main className="overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative py-28 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">

          <h1 className="text-5xl font-bold text-[var(--primary)] leading-tight">
            Reliable Engineering Support  
            <br />For Production Systems
          </h1>

          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            We help companies stabilize existing software, scale backend systems,
            manage deployments, and provide long-term development teams.
          </p>

          <div className="flex justify-center gap-4 pt-6">
            <Link
              href="/get-quote"
              className="px-7 py-3 rounded-lg bg-[var(--primary)] text-white"
            >
              Get Free Consultation
            </Link>

            <Link
              href="/hire-developers"
              className="px-7 py-3 rounded-lg border border-[#1E293B]"
            >
              Hire Developers
            </Link>
          </div>

        </div>
      </section>



      {/* ================= TRUST MESSAGE ================= */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          When existing systems need to keep working
        </h2>

        <p className="text-[var(--muted)] max-w-3xl mx-auto">
          Gangwal IT Services works with teams that already have software in
          production and need it to remain reliable as usage, expectations,
          and complexity grow.
        </p>
      </section>



      {/* ================= SERVICES GRID ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-24">

        <h2 className="text-3xl font-semibold mb-12 text-center">
          Core Engineering Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((s) => (
            <div
              key={s.title}
              className="border border-[#1E293B] rounded-xl p-7 hover:bg-[#020617]/60 transition"
            >
              <h3 className="text-xl font-semibold mb-3">
                {s.title}
              </h3>

              <p className="text-[var(--muted)] text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}

        </div>

      </section>



      {/* ================= WHY CLIENTS CHOOSE YOU ================= */}
      <section className="bg-[#020617] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Built for real production environments
            </h2>

            <ul className="space-y-4 text-[var(--muted)]">

              <li>✔ Work inside existing live applications</li>
              <li>✔ Handle unclear or undocumented systems</li>
              <li>✔ Provide long-term engineering continuity</li>
              <li>✔ Reduce recurring production issues</li>
              <li>✔ Support deployments and infrastructure</li>

            </ul>
          </div>

          <div className="flex items-center text-[var(--muted)]">
            <p>
              We don’t just build new apps.  
              We help teams maintain what already exists,
              fix what keeps breaking, and scale systems
              without downtime.
            </p>
          </div>

        </div>
      </section>



      {/* ================= FINAL CTA ================= */}
      <section className="py-24 text-center">

        <h2 className="text-3xl font-semibold mb-6">
          Need stable long-term engineering support?
        </h2>

        <Link
          href="/get-quote"
          className="px-9 py-4 rounded-lg bg-[var(--primary)] text-white text-lg"
        >
          Talk to Our Team
        </Link>

      </section>

    </main>
  );
}



const services = [
  {
    title: "IT Setup & Cleanup",
    desc: "Making sense of systems that were built quickly and now need stability, structure, and clarity.",
  },
  {
    title: "Backend & Database Support",
    desc: "Working inside existing Node.js and database setups to fix issues and improve workflows.",
  },
  {
    title: "Existing Application Work",
    desc: "Maintaining and modifying live applications without breaking what people rely on.",
  },
  {
    title: "Cloud & Deployment Help",
    desc: "Supporting deployments, environments, and infrastructure that feel fragile or hard to manage.",
  },
  {
    title: "Long-Term Development Support",
    desc: "Ongoing engineering support for teams that need continuity, not rotating freelancers.",
  },
  {
    title: "Hard-to-Explain Technical Issues",
    desc: "Handling problems that don’t come with documentation or clear ownership.",
  },
];