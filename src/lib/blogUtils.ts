export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeTags(input: string | string[] | undefined) {
  const raw = Array.isArray(input) ? input.join(",") : input || "";
  return raw
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx);
}

export function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ");
}

export function estimateReadingTime(content: string) {
  const clean = stripHtml(content);
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return minutes;
}

export function buildExcerpt(excerpt: string | undefined, content: string) {
  if (excerpt && excerpt.trim()) return excerpt.trim();

  const clean = stripHtml(content).replace(/\s+/g, " ").trim();
  return clean.length > 170 ? `${clean.slice(0, 167)}...` : clean;
}

export function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Only allow http(s) URLs or site-relative paths for cover images. */
export function cleanImageUrl(input: unknown) {
  const value = String(input || "").trim();
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : "";
  } catch {
    return "";
  }
}

export function toPositiveInt(value: string | null, fallback: number) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}
