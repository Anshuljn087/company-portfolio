import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    experience: String,
    description: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job =
  mongoose.models.Job || mongoose.model("Job", JobSchema);
