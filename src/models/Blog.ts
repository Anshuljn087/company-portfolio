import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
