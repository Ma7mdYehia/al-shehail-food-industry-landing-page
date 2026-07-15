// Supabase server client foundation (App Router).
//
// Uses the PUBLIC anon key together with the request's cookie store so that,
// once Supabase Auth is added, sessions are read/refreshed correctly on the
// server. It deliberately does NOT use SUPABASE_SERVICE_ROLE_KEY — the
// service-role key bypasses row-level security and belongs only in dedicated,
// trusted server tasks, never in the normal request-scoped client.
//
// Foundation-only: nothing calls this yet, no queries are made, and the
// website still reads from the TypeScript content modules under lib/.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "@/lib/env/public";

/**
 * Creates a request-scoped Supabase server client bound to the Next.js cookie
 * store. Call this inside a Server Component, Route Handler, or Server Action
 * (where `cookies()` is available) — not at module top level.
 */
export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `cookies().set` throws when called from a Server Component render
          // (read-only). This is safe to ignore — session refresh is handled
          // by middleware/route handlers, which will be added in a later patch.
        }
      },
    },
  });
}
