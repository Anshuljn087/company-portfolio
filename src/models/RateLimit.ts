import { Schema, model, models } from "mongoose";

// One document per rate-limit key. MongoDB's TTL monitor removes it after
// `expiresAt`, so the collection cleans itself up.
const RateLimitSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const RateLimit = models.RateLimit || model("RateLimit", RateLimitSchema);
