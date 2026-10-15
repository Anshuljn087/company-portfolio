import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    location: { type: String, trim: true, maxlength: 200 },
    experience: { type: String, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 20000 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job =
  mongoose.models.Job || mongoose.model("Job", JobSchema);
