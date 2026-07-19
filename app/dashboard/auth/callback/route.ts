import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/env/public";
import {
  DASHBOARD_HOME,
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_UPDATE_PASSWORD_PATH,
  safeDashboardReturnPath,
} from "@/lib/auth/redirect";

// PKCE / recovery / invite callback. Exchanges the auth code for a session
// SERVER-SIDE, then redirects to a VALIDATED internal dashboard path. Tokens are
// never placed in the redirect URL, logged, rendered, or stored client-side.
// Invalid/expired links produce a generic error redirect to login.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type"); // "recovery" | "invite" | ...
  const rawNext =
    requestUrl.searchParams.get("next") ?? requestUrl.searchParams.get("redirect_to");

  // Recovery/invite links should land on the password-update screen.
  const defaultNext =
    type === "recovery" || type === "invite" ? DASHBOARD_UPDATE_PASSWORD_PATH : DASHBOARD_HOME;
  const next = safeDashboardReturnPath(rawNext, defaultNext);

  const genericError = () =>
    NextResponse.redirect(new URL(`${DASHBOARD_LOGIN_PATH}?error=auth`, origin));

  if (!code || !hasSupabasePublicConfig()) return genericError();

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return genericError();
  } catch {
    return genericError();
  }

  return NextResponse.redirect(new URL(next, origin));
}
