import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | YourCompany",
  description: "Get in touch with our team for a free consultation",
};

export default function ContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-[var(--primary)] mb-6">
        Contact Us
      </h1>

      <p className="text-[var(--muted)] max-w-xl">
        Tell us about your project or hiring needs. We’ll get back within 24 hours.
      </p>
    </section>
  );
}
