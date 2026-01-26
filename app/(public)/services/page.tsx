import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | YourCompany",
  description: "IT services, dedicated developers and full-cycle software development",
};

export default function ServicesPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-[var(--primary)] mb-6">
        Our Services
      </h1>

      <p className="text-[var(--muted)] max-w-2xl">
        We offer dedicated developers, end-to-end product development,
        and scalable IT solutions for startups and enterprises.
      </p>
    </section>
  );
}
