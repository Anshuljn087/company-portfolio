import Link from "next/link";
import { redirect } from "next/navigation";
import { connectDB } from "@/src/lib/db";
import { Job } from "@/src/models/Job";
import { isAdminFromCookies } from "@/src/lib/adminAuth";

type AdminJob = {
  _id: string;
  title: string;
  location?: string;
  experience?: string;
  isActive: boolean;
};

export default async function AdminJobs() {
  if (!(await isAdminFromCookies())) redirect("/admin/login");

  await connectDB();
  const jobs = (await Job.find().sort({ createdAt: -1 }).lean()) as unknown as AdminJob[];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link
          href="/admin/jobs/new"
          className="bg-[var(--primary)] px-4 py-2 rounded"
        >
          + New Job
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={String(job._id)} className="border border-[#1E293B] p-4 rounded">
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm text-[var(--muted)]">
              {job.location || "Remote"} | {job.experience || "Any experience"} |{" "}
              {job.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-[var(--muted)]">No jobs yet.</p>}
      </div>
    </section>
  );
}
