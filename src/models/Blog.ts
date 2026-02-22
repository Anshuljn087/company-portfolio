import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    authorName: { type: String, default: "Gangwal IT Team" },
    category: { type: String, default: "Engineering" },
    tags: { type: [String], default: [] },
    readingTime: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
