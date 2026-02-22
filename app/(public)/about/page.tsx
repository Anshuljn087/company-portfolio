import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-[#F7FAFC] to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="Team working on long-term systems"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/80 via-[#0B1220]/65 to-[#0B1220]/35" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-white">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Built for systems that have to last
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white/90 leading-relaxed">
            We support teams that need software to keep performing long after
            launch - through growth, change, and ongoing operational pressure.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              GIT Services was formed around a simple understanding: technology
              does not stop changing after it goes live.
            </p>

            <p>
              Many systems fail not because they were built poorly, but because
              growth, time, and changing teams introduce new pressure. We work
              with these realities instead of ignoring them.
            </p>

            <p>
              We don&apos;t start with long requirement documents or broad promises.
              We extract clarity by understanding how systems are already being
              used, where they struggle, and what actually needs to change.
            </p>
          </div>

          <div className="relative h-[340px] rounded-2xl overflow-hidden border border-[#D6E0EA] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978"
              alt="Planning and architecture discussion"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-14">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <div className="bg-white/95 rounded-2xl border border-[#D6E0EA] p-8">
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
              How We Work
            </h2>
            <div className="mt-5 space-y-4 text-gray-700 leading-relaxed">
              <p>
                We engineer only what can survive real usage. After delivery, we
                stay involved to fix issues, adjust behavior, and improve systems
                as they evolve.
              </p>
              <p>
                Alongside experienced engineers, we also train and mentor interns
                in a controlled way - allowing them to learn by observing and
                supporting real systems, while responsibility remains with senior
                developers.
              </p>
              <p className="font-semibold text-gray-900">
                GIT Services works best with teams that value steady progress,
                honest decisions, and long-term technical ownership.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[#D6E0EA] min-h-[360px]">
            <Image
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
              alt="Production engineering systems"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/35 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white">
              <h3 className="text-2xl font-semibold">Long-term by default</h3>
              <p className="mt-3 text-white/90">
                We optimize for reliability and continuity, not short-lived
                speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-[#D6E0EA] bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[var(--primary)]">
              Production-Focused
            </h3>
            <p className="mt-3 text-gray-600">
              We build systems designed for real usage, not demos.
            </p>
          </div>

          <div className="rounded-xl border border-[#D6E0EA] bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[var(--primary)]">
              Long-Term Support
            </h3>
            <p className="mt-3 text-gray-600">
              Our involvement continues after launch.
            </p>
          </div>

          <div className="rounded-xl border border-[#D6E0EA] bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[var(--primary)]">
              Real Engineering
            </h3>
            <p className="mt-3 text-gray-600">
              Senior developers lead all production decisions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
