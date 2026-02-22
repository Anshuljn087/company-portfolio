"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const professionalOptions = [
  "Backend Developers",
  "Frontend Developers",
  "QA Engineers",
  "Business Analysts",
  "Scrum Master",
  "Project Manager",
  "DevOps / Cloud Engineers",
  "Technical Leads",
  "System Support Engineers",
  "AI/LLM Developers",
  "UI/UX Designers",
];

const internInterestOptions = [
  "Development",
  "QA",
  "Business Analysis",
  "Cloud basics",
  "General IT project exposure",
];

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState<"experienced" | "intern">(
    "experienced",
  );
  const [loadingExperienced, setLoadingExperienced] = useState(false);
  const [loadingIntern, setLoadingIntern] = useState(false);

  async function handleExperiencedSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoadingExperienced(true);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experienced",
          fullName: String(formData.get("fullName") || ""),
          email: String(formData.get("email") || ""),
          currentRole: String(formData.get("currentRole") || ""),
          yearsOfExperience: String(formData.get("yearsOfExperience") || ""),
          primaryExpertise: String(formData.get("primaryExpertise") || ""),
          projectEndToEnd: String(formData.get("projectEndToEnd") || ""),
          availability: String(formData.get("availability") || ""),
          additionalInfo: String(formData.get("additionalInfo") || ""),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unable to submit profile");

      form.reset();
      toast.success("Profile submitted");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to submit profile";
      toast.error(message);
    } finally {
      setLoadingExperienced(false);
    }
  }

  async function handleInternSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoadingIntern(true);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "intern",
          fullName: String(formData.get("fullName") || ""),
          email: String(formData.get("email") || ""),
          currentStatus: String(formData.get("currentStatus") || ""),
          areaOfInterest: String(formData.get("areaOfInterest") || ""),
          whyFullProjects: String(formData.get("whyFullProjects") || ""),
          availability: String(formData.get("availability") || ""),
          optionalWork: String(formData.get("optionalWork") || ""),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unable to submit interest");

      form.reset();
      toast.success("Interest submitted");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to submit interest";
      toast.error(message);
    } finally {
      setLoadingIntern(false);
    }
  }

  return (
    <main className="bg-gradient-to-b from-[#F7FAFC] to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Team collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/80 via-[#0B1220]/65 to-[#0B1220]/40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-white">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            People who stay involved
          </h1>

          <div className="mt-8 max-w-3xl space-y-4 text-lg text-white/90">
            <p>
              We&apos;re building a team of professionals who prefer depth over
              speed.
            </p>
            <p>
              Our work involves building new systems thoughtfully and supporting
              existing software that real users depend on every day. That
              requires patience, clarity, and people who are comfortable taking
              ownership over time.
            </p>
            <p>
              If you prefer long-term responsibility over short-term tasks,
              you&apos;ll feel at home here.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
              Who we work with
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-3 text-gray-700">
              <p>Backend Developers</p>
              <p>Frontend Developers</p>
              <p>QA Engineers</p>
              <p>Business Analysts</p>
              <p>Scrum Master</p>
              <p>Project Manager</p>
              <p>DevOps / Cloud Engineers</p>
              <p>Technical Leads</p>
              <p>System Support Engineers</p>
              <p>AI/LLM Developers</p>
              <p>UI/UX Designers</p>
              <p>Interns</p>
            </div>
            <p className="mt-6 text-lg text-gray-700">
              If you care about how a project starts, evolves, and runs in the
              real world - you belong here.
            </p>
          </div>

          <div className="relative h-[320px] rounded-2xl overflow-hidden border border-[#D6E0EA] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978"
              alt="Career growth discussion"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-14">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <div className="bg-white/95 rounded-2xl p-8 border border-[#D6E0EA]">
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
              Experienced Professionals
            </h2>
            <div className="mt-6 space-y-4 text-gray-700">
              <p>
                If you&apos;ve worked on real projects before, you know that software
                is more than code. It&apos;s planning, trade-offs, deadlines,
                production issues, and ongoing improvement.
              </p>
              <p>Here, you won&apos;t just complete isolated tasks.</p>
              <div>
                <p className="font-semibold text-gray-900 mb-2">You&apos;ll:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Participate in building new systems</li>
                  <li>Improve existing ones</li>
                  <li>Be involved in deployment and support</li>
                  <li>Contribute to long-term technical decisions</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  We look for people who:
                </p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Understand system thinking, not just features</li>
                  <li>Can work independently but communicate clearly</li>
                  <li>Take ownership beyond ticket completion</li>
                  <li>
                    Are comfortable with both new builds and existing codebases
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-8 border border-[#D6E0EA]">
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
              Early Career / Intern Path
            </h2>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Learn how complete projects are delivered
            </h3>
            <div className="mt-5 space-y-4 text-gray-700">
              <p>
                We occasionally work with interns who want exposure to how real
                IT projects are handled from planning to deployment.
              </p>
              <p>
                Interns here don&apos;t just code small features. They observe how
                decisions are made, how systems are structured, how testing is
                done, and how releases are managed.
              </p>
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  Learning areas include:
                </p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Understanding project requirements</li>
                  <li>Supporting development and testing</li>
                  <li>Observing deployment processes</li>
                  <li>Assisting in documentation</li>
                  <li>Learning how systems evolve after launch</li>
                </ul>
              </div>
              <p>Responsibility increases gradually.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-[#D6E0EA] shadow-xl overflow-hidden">
          <div className="p-3 bg-[#EEF4F9] border-b border-[#D6E0EA]">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("experienced")}
                className={`rounded-lg py-3 text-sm font-semibold transition ${
                  activeTab === "experienced"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white text-[#31465A] border border-[#D6E0EA]"
                }`}
              >
                Experienced Professional Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("intern")}
                className={`rounded-lg py-3 text-sm font-semibold transition ${
                  activeTab === "intern"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white text-[#31465A] border border-[#D6E0EA]"
                }`}
              >
                Intern Form
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "experienced" ? (
              <form onSubmit={handleExperiencedSubmit} className="space-y-5">
                <input
                  name="fullName"
                  required
                  placeholder="Full Name"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="currentRole"
                  required
                  placeholder="Current Role"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="yearsOfExperience"
                  required
                  placeholder="Years of Experience"
                  className="w-full p-4 border rounded-lg"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Expertise (Picklist)
                  </label>
                  <select
                    name="primaryExpertise"
                    required
                    className="w-full p-4 border rounded-lg bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select expertise
                    </option>
                    {professionalOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  name="projectEndToEnd"
                  required
                  rows={5}
                  placeholder="Describe a project you've worked on end-to-end"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="availability"
                  required
                  placeholder="Availability"
                  className="w-full p-4 border rounded-lg"
                />
                <textarea
                  name="additionalInfo"
                  rows={4}
                  placeholder="Anything else relevant (optional)"
                  className="w-full p-4 border rounded-lg"
                />

                <button
                  type="submit"
                  disabled={loadingExperienced}
                  className="w-full py-4 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-semibold uppercase tracking-wide hover:bg-[var(--primary)] hover:text-white transition disabled:opacity-60"
                >
                  {loadingExperienced ? "Submitting..." : "Submit profile"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleInternSubmit} className="space-y-5">
                <input
                  name="fullName"
                  required
                  placeholder="Full Name"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="currentStatus"
                  required
                  placeholder="Current Status"
                  className="w-full p-4 border rounded-lg"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area of Interest
                  </label>
                  <select
                    name="areaOfInterest"
                    required
                    className="w-full p-4 border rounded-lg bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select area of interest
                    </option>
                    {internInterestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  name="whyFullProjects"
                  required
                  rows={5}
                  placeholder="Why do you want to work on full IT projects instead of isolated tasks?"
                  className="w-full p-4 border rounded-lg"
                />
                <input
                  name="availability"
                  required
                  placeholder="Availability"
                  className="w-full p-4 border rounded-lg"
                />
                <textarea
                  name="optionalWork"
                  rows={4}
                  placeholder="Anything you've built or studied (optional)"
                  className="w-full p-4 border rounded-lg"
                />

                <button
                  type="submit"
                  disabled={loadingIntern}
                  className="w-full py-4 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-semibold uppercase tracking-wide hover:bg-[var(--primary)] hover:text-white transition disabled:opacity-60"
                >
                  {loadingIntern ? "Submitting..." : "Submit interest"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-2 pb-24">
        <div className="relative rounded-2xl overflow-hidden border border-[#D6E0EA]">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
            alt="Long-term project team"
            fill
            className="object-cover"
          />
          <div className="relative z-10 bg-[#0B1220]/70 p-10">
            <h2 className="text-2xl font-semibold text-white">Final Note</h2>
            <p className="mt-4 text-white/90 max-w-3xl">
              We grow our team thoughtfully. There may not always be immediate
              openings, but we value people who want to be part of complete,
              long-term IT projects.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/80 to-transparent" />
        </div>
      </section>
    </main>
  );
}
