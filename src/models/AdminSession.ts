import { Schema, model, models } from "mongoose";

// Server-side record of each issued admin session so it can be revoked.
const AdminSessionSchema = new Schema({
  _id: { type: String, required: true }, // session id (jti)
  email: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const AdminSession =
  models.AdminSession || model("AdminSession", AdminSessionSchema);
