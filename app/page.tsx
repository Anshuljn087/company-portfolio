import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        {/* TEXT + IMAGE PARALLEL */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* TEXT */}
          <div>
            <h1 className="text-5xl md:text-4xl font-bold leading-tight text-[var(--primary)]">
              Built To Last,
              <br /> Whether New Or Already Running
            </h1>

            <p className="mt-6 text-lg text-[var(--muted)]">
              GIT Services supports teams at different stages of their software
              journey. Some are starting with a blank repository. Others are
              carrying systems that have been live for years.
            </p>

            <p className="mt-4 text-lg text-[var(--muted)]">
              In both cases, the work is the same: understand the problem
              properly, make practical technical choices, and ensure the system
              continues to function as real users, data, and expectations grow.
            </p>

            <p className="mt-4 text-lg text-[var(--muted)]">
              We focus on steady improvement, not fast promises.
            </p>
          </div>

          {/* IMAGE */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
              alt="team"
              width={650}
              height={420}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CONTACT + CAREERS FULL WIDTH BG */}
      <section className="bg-[#0B1220] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* CONTACT CARD */}
            <div
              className="
        group text-center rounded-3xl
        border border-[#243044]
        bg-[#0F172A]/60
        backdrop-blur
        p-10 transition duration-300
        hover:border-[var(--primary)]
        hover:shadow-2xl
      "
            >
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692"
                alt="contact"
                width={650}
                height={420}
                className="rounded-2xl mx-auto transition duration-500 group-hover:scale-105"
              />

              <h3 className="text-2xl font-semibold mt-8 mb-3">
                Discuss Your Project
              </h3>

              <p className="text-[var(--muted)] max-w-md mx-auto">
                Tell us what you're building or maintaining. We'll suggest the
                most practical technical approach.
              </p>

              <Link href="/contact">
                <button
                  className="
            mt-10 px-12 py-4 rounded-xl
            border border-[var(--primary)]
            text-[var(--primary)]
            text-lg font-semibold uppercase tracking-wide
            transition duration-300 ease-in-out
            hover:bg-[var(--primary)]
            hover:text-white
            hover:scale-105
            hover:shadow-xl
            active:scale-95
            w-full sm:w-auto
          "
                >
                  CONTACT US
                </button>
              </Link>
            </div>

            {/* CAREERS CARD */}
            <div
              className="
        group text-center rounded-3xl
        border border-[#243044]
        bg-[#0F172A]/60
        backdrop-blur
        p-10 transition duration-300
        hover:border-[var(--primary)]
        hover:shadow-2xl
      "
            >
              <Image
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                alt="careers"
                width={650}
                height={420}
                className="rounded-2xl mx-auto transition duration-500 group-hover:scale-105"
              />

              <h3 className="text-2xl font-semibold mt-8 mb-3">
                Join Our Team
              </h3>

              <p className="text-[var(--muted)] max-w-md mx-auto">
                Explore open roles and work with teams building real production
                systems.
              </p>

              <Link href="/careers">
                <button
                  className="
            mt-10 px-12 py-4 rounded-xl
            border border-[var(--primary)]
            text-[var(--primary)]
            text-lg font-semibold uppercase tracking-wide
            transition duration-300 ease-in-out
            hover:bg-[var(--primary)]
            hover:text-white
            hover:scale-105
            hover:shadow-xl
            active:scale-95
            w-full sm:w-auto
          "
                >
                  CAREERS
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Core IT Support Services
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "IT Setup & Cleanup",
              text: "Making sense of systems built quickly and now needing stability, structure, and clarity.",
            },
            {
              title: "Backend & Database Support",
              text: "Working inside Node.js and database setups to fix issues and improve performance.",
            },
            {
              title: "Existing Application Work",
              text: "Maintaining and modifying live applications without breaking production workflows.",
            },
            {
              title: "Cloud & Deployment Help",
              text: "Fixing fragile cloud setups and making deployments reliable and predictable.",
            },
            {
              title: "Long-Term Development Support",
              text: "Stable engineers instead of rotating freelancers for ongoing continuity.",
            },
            {
              title: "Hard-to-Explain Technical Issues",
              text: "Handling undocumented systems, unclear ownership, and legacy complexity.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="border border-[#1E293B] rounded-xl p-8 hover:border-[var(--primary)] transition"
            >
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>

              <p className="text-[var(--muted)]">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CLIENTS CHOOSE */}
      <section className="bg-[#0B1220] py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="team"
            width={550}
            height={420}
            className="rounded-xl"
          />

          <div>
            <h2 className="text-4xl text-[var(--muted)] font-bold mb-6">
              Why companies work with us
            </h2>

            <ul className="space-y-4 text-[var(--muted)]">
              <li>✔ Production-safe development approach</li>
              <li>✔ Experienced MERN & backend engineers</li>
              <li>✔ Long-term support mindset</li>
              <li>✔ Clear communication with business teams</li>
              <li>✔ Fast onboarding into existing systems</li>
            </ul>
          </div>
        </div>
      </section>

      
    </main>
  );
}
