"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setSubmitted(false);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(formData.get("fullName") || ""),
          workEmail: String(formData.get("workEmail") || ""),
          companyName: String(formData.get("companyName") || ""),
          currentSituation: String(formData.get("currentSituation") || ""),
          timeline: String(formData.get("timeline") || ""),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Unable to send message");
      }

      form.reset();
      setSubmitted(true);
      toast.success("Conversation request sent");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Unable to send message";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gradient-to-b from-[#F7FAFC] to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
            alt="Conversation planning session"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/80 via-[#0B1220]/65 to-[#0B1220]/35" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-white">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Start with a conversation
          </h1>

          <div className="mt-7 max-w-3xl space-y-4 text-lg text-white/90">
            <p>
              If you&apos;re dealing with an existing system that needs support,
              improvement, or long-term care, you can reach out here.
            </p>
            <p>
              We usually start with a short conversation to understand the
              situation before suggesting next steps.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
              What happens next
            </h2>
            <div className="mt-5 space-y-4 text-gray-700 text-lg">
              <p>
                We review your context, identify where support is needed most,
                and suggest practical next steps based on your current stage.
              </p>
              <p>
                Whether it&apos;s ongoing system care, targeted improvements, or a
                new build from scratch, we prioritize clarity before action.
              </p>
            </div>
          </div>

          <div className="relative h-[320px] rounded-2xl overflow-hidden border border-[#D6E0EA] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978"
              alt="Technical discussion"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl border border-[#D6E0EA] shadow-xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="fullName"
                required
                type="text"
                placeholder="Full Name"
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
              />

              <input
                name="workEmail"
                required
                type="email"
                placeholder="Work Email"
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
              />

              <input
                name="companyName"
                required
                type="text"
                placeholder="Company Name"
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
              />

              <div className="space-y-2">
                <label
                  htmlFor="currentSituation"
                  className="text-sm font-medium text-gray-700"
                >
                  Briefly describe what you&apos;re dealing with (existing
                  system, support need, or ongoing work, build new project from
                  scratch)
                </label>
                <textarea
                  id="currentSituation"
                  name="currentSituation"
                  required
                  rows={6}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Optional: Timeline
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="timeline" value="Immediate" />
                    Immediate
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeline"
                      value="Planning phase"
                    />
                    Planning phase
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeline"
                      value="Ongoing support"
                    />
                    Ongoing support
                  </label>
                </div>
              </div>

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
                {loading ? "Sending..." : "Start the conversation"}
              </button>

              {submitted && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  <p>Thanks for reaching out.</p>
                  <p>
                    We usually respond within 1-2 business days after reviewing
                    the details.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
