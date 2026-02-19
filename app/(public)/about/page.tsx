import Image from "next/image";

export default function AboutPage() {
  return (
    <main>

      {/* HERO */}
      <section className="relative h-[360px] flex items-center justify-center text-center">

        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="about hero"
          fill
          className="object-cover opacity-20"
        />

        <h1 className="relative text-5xl font-bold text-[var(--primary)]">
          Built for systems that have to last
        </h1>

      </section>


      {/* CONTENT */}
      <section className="max-w-4xl mx-auto px-6 py-20 space-y-8 text-lg leading-relaxed text-gray-700">

        <p>
          GIT Services was formed around a simple understanding: technology
          does not stop changing after it goes live.
        </p>

        <p>
          Many systems fail not because they were built poorly, but because
          growth, time, and changing teams introduce new pressure.
          We work with these realities instead of ignoring them.
        </p>

        <p>
          We don’t start with long requirement documents or broad promises.
          We extract clarity by understanding how systems are already being
          used, where they struggle, and what actually needs to change.
        </p>

        <p>
          We engineer only what can survive real usage. After delivery, we
          stay involved to fix issues, adjust behaviour, and improve systems
          as they evolve.
        </p>

        <p>
          Alongside experienced engineers, we also train and mentor interns
          in a controlled way — allowing them to learn by observing and
          supporting real systems, while responsibility remains with senior
          developers.
        </p>

        <p className="font-semibold text-gray-900">
          GIT Services works best with teams that value steady progress,
          honest decisions, and long-term technical ownership.
        </p>

      </section>


      {/* TRUST STRIP */}
      <section className="bg-gray-50 py-20 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-3xl font-bold text-[var(--primary)]">Production-Focused</h3>
            <p className="mt-3 text-gray-600">
              We build systems designed for real usage, not demos.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[var(--primary)]">Long-Term Support</h3>
            <p className="mt-3 text-gray-600">
              Our involvement continues after launch.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[var(--primary)]">Real Engineering</h3>
            <p className="mt-3 text-gray-600">
              Senior developers lead all production decisions.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}