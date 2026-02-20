"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = e.target;

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.value,
          phone: form.phone.value,
          message: form.message.value,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Email failed");
      }

      toast.success("Message sent 🚀");
      form.reset();
    } catch (err: any) {
      console.error(err);
      toast.error("Email failed — check SMTP");
    }

    setLoading(false);
  }

  return (
    <main>
      <section className="relative h-[420px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
          alt="hero"
          fill
          className="object-cover"
          priority
        />

        {/* PREMIUM GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/70" />

        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-5xl font-bold text-[var(--primary)]">
            Contact Gangwal IT Services
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Tell us about your project and we’ll help you plan the right
            solution.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-10 rounded-2xl border border-gray-200 shadow-xl"
        >
          <input
            name="email"
            required
            type="email"
            placeholder="Email Address *"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
          />

          <input
            name="phone"
            placeholder="Contact Number"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
          />

          <textarea
            name="message"
            required
            rows={6}
            placeholder="Tell us about your project..."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
          />

          <button
            disabled={loading}
            className="
              w-full py-4 rounded-xl
              border-2 border-[var(--primary)]
              text-[var(--primary)]
              uppercase font-semibold tracking-wide
              transition duration-300
              hover:bg-[var(--primary)]
              hover:text-white
              hover:shadow-lg
              active:scale-95
              disabled:opacity-60
              flex items-center justify-center gap-3
            "
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            )}

            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
}
