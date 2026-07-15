// Supabase browser client foundation.
//
// Uses ONLY the public config (NEXT_PUBLIC_SUPABASE_URL + anon key) and is
// safe to use from Client Components. This is foundation-only: it is not yet
// wired to any content — the website still reads from the TypeScript content
// modules under lib/. No database queries are performed here.

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/env/public";

/**
 * Creates a Supabase client for use in the browser (Client Components).
 * Call this inside a component/hook, not at module top level, so the env
 * check runs only when Supabase is actually used.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  return createBrowserClient(url, anonKey);
}
