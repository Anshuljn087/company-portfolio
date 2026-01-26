export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[var(--primary)]">
          IT Services & Dedicated Developers
        </h1>

        <p className="text-[var(--muted)] max-w-xl">
          We help startups and enterprises build scalable products with
          dedicated engineering teams.
        </p>

        <button className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white hover:opacity-90">
          Get Free Consultation
        </button>
      </div>
    </main>
  );
}
