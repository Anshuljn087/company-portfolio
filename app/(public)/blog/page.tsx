import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | YourCompany",
  description: "Insights on software development, outsourcing and technology",
};

export default function BlogPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-[var(--primary)] mb-6">
        Blog
      </h1>

      <p className="text-[var(--muted)]">
        Articles, guides and insights from our engineering team.
      </p>
    </section>
  );
}
