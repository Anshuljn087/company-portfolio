"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkSession() {
      let authenticated = false;
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        authenticated = Boolean((await res.json()).authenticated);
      } catch {
        authenticated = false;
      }

      if (!authenticated) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkSession();
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      alert("Could not save the job. Please check the fields and try again.");
      return;
    }

    window.location.href = "/admin/jobs";
  }

  if (checkingAuth) return null;

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-6">Add Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Job Title"
          required
          className="w-full p-3 bg-[#020617] border border-[#1E293B]"
        />
        <input
          name="location"
          placeholder="Location / Remote"
          required
          className="w-full p-3 bg-[#020617] border border-[#1E293B]"
        />
        <input
          name="experience"
          placeholder="Experience (e.g. 2-4 years)"
          required
          className="w-full p-3 bg-[#020617] border border-[#1E293B]"
        />
        <textarea
          name="description"
          placeholder="Job Description"
          required
          className="w-full p-3 bg-[#020617] border border-[#1E293B]"
        />

        <button className="bg-[var(--primary)] px-4 py-2 rounded text-white">
          Create Job
        </button>
      </form>
    </section>
  );
}
