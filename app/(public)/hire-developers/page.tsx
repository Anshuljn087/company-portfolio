import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Developers | YourCompany",
  description: "Hire dedicated frontend, backend and full stack developers",
};

export default function HireDevelopersPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-[var(--primary)] mb-6">
        Hire Dedicated Developers
      </h1>

      <p className="text-[var(--muted)] max-w-2xl">
        Scale your team with experienced frontend, backend and full-stack
        developers working as your extended remote team.
      </p>
    </section>
  );
}
