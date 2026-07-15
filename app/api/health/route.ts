import { NextResponse } from "next/server";

// Runtime health endpoint. Its mere existence (a route handler) proves the app
// is served by the Next.js/Vercel runtime rather than a static /out export —
// static export cannot serve route handlers. Forced dynamic so it always runs
// at request time.
//
// Intentionally minimal and safe: no environment values, deployment IDs,
// dependency versions, database details, or secrets are returned.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "al-shehail-food-industries-website" },
    { status: 200 }
  );
}
