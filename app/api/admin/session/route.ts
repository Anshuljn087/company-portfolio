import { NextResponse } from "next/server";
import { isAdminFromCookies } from "@/src/lib/adminAuth";

export async function GET() {
  const authenticated = await isAdminFromCookies();
  return NextResponse.json({ authenticated });
}
