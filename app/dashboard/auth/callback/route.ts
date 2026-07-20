import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { hasSupabasePublicConfig, getSupabasePublicConfig } from "@/lib/env/public";
import { getDashboardAuthFlowSecret, hasDashboardAuthFlowSecret } from "@/lib/env/server";
import {
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_UPDATE_PASSWORD_PATH,
} from "@/lib/auth/redirect";
import {
  FLOW_GATE_COOKIE,
  RECOVERY_STATE_COOKIE,
  GATE_TTL_SECONDS,
  flowCookieOptions,
  createGateToken,
  constantTimeEqual,
  randomToken,
  hashNonce,
  type FlowPurpose,
} from "@/lib/auth/flow-gate";

// Recovery/invite callback. Verifies the flow SERVER-SIDE, then mints a signed,
// short-lived, user-bound authorization gate (HttpOnly cookie) and redirects to
// /dashboard/update-password. Two supported paths:
//   * PKCE recovery: `code` + a matching `state` cookie (set by the reset
//     action). exchangeCodeForSession().
//   * Email OTP (invite/recovery via token_hash): verifyOtp({ token_hash, type }).
// Mixed/missing/unsupported/ambiguous inputs, or a state mismatch, are rejected
// with a generic error. Tokens (code/token_hash) are never logged, rendered, or
// placed in the outgoing redirect.
export const dynamic = "force-dynamic";

const ALLOWED_OTP_TYPES: readonly EmailOtpType[] = ["invite", "recovery"];

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const params = requestUrl.searchParams;

  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const state = params.get("state");

  // Every Supabase cookie mutation (session set on success, deletions on
  // signOut) is captured here so it can be replayed onto WHICHEVER response we
  // finally return — including the generic error redirect. Without this, a
  // fresh error response would drop the sign-out cookie deletions and leave a
  // stale, half-authenticated Supabase session behind.
  const cookieWrites: { name: string; value: string; options: Record<string, unknown> }[] = [];

  // Build a generic login error that ALSO carries every accumulated Supabase
  // cookie deletion and explicitly clears the flow gate + one-time recovery
  // state. A failed callback must never preserve a stale gate or recovery state.
  const genericError = () => {
    const errorResponse = NextResponse.redirect(
      new URL(`${DASHBOARD_LOGIN_PATH}?error=auth`, origin)
    );
    for (const { name, value, options } of cookieWrites) {
      errorResponse.cookies.set(name, value, options);
    }
    errorResponse.cookies.set(FLOW_GATE_COOKIE, "", { ...flowCookieOptions(0), maxAge: 0 });
    errorResponse.cookies.set(RECOVERY_STATE_COOKIE, "", { ...flowCookieOptions(0), maxAge: 0 });
    return errorResponse;
  };

  if (!hasSupabasePublicConfig() || !hasDashboardAuthFlowSecret()) return genericError();

  // Exactly one of { code, token_hash } must be present (reject both/neither).
  const hasCode = typeof code === "string" && code.length > 0;
  const hasHash = typeof tokenHash === "string" && tokenHash.length > 0;
  if (hasCode === hasHash) return genericError();

  // Always land on the password-set page (ignore any client-supplied `next` to
  // avoid post-gate open redirects). This URL carries no tokens.
  const response = NextResponse.redirect(new URL(DASHBOARD_UPDATE_PASSWORD_PATH, origin));

  const { url, anonKey } = getSupabasePublicConfig();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Record the mutation so it survives onto the error response too, and
          // apply it to the success response.
          cookieWrites.push({ name, value, options: options as Record<string, unknown> });
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let purpose: FlowPurpose;

  if (hasCode) {
    // Recovery PKCE requires a matching state cookie (constant-time compare).
    const stateCookie = request.cookies.get(RECOVERY_STATE_COOKIE)?.value;
    if (!state || !stateCookie || !constantTimeEqual(state, stateCookie)) return genericError();
    const { error } = await supabase.auth.exchangeCodeForSession(code as string);
    if (error) return genericError();
    purpose = "recovery";
  } else {
    // Email OTP invite/recovery. Allowlist the type; verify the hash server-side.
    if (!type || !ALLOWED_OTP_TYPES.includes(type as EmailOtpType)) return genericError();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash as string,
      type: type as EmailOtpType,
    });
    if (error) return genericError();
    purpose = type as FlowPurpose;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return genericError();

  // Register a DURABLE single-use nonce (hash only) bound to this user BEFORE
  // issuing the gate cookie. If registration fails, fail closed: sign out the
  // just-created session locally and return a generic error (no gate minted).
  const nonce = randomToken(32);
  const expiresAt = new Date(Date.now() + GATE_TTL_SECONDS * 1000);
  let registered = false;
  try {
    const { data, error } = await supabase.rpc("register_dashboard_flow_nonce", {
      p_nonce_hash: hashNonce(nonce),
      p_purpose: purpose,
      p_expires_at: expiresAt.toISOString(),
    });
    registered = !error && data === true;
  } catch {
    registered = false;
  }
  if (!registered) {
    // Fail closed: drop the just-created session. signOut writes its cookie
    // deletions through the adapter above (into cookieWrites), and genericError
    // replays them onto the returned error response so no stale Supabase session
    // — or flow gate / recovery state — survives. Inspect the returned {error}
    // (never expose it) so a failed local sign-out is not silently ignored.
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) {
        await supabase.auth.signOut({ scope: "global" }).catch(() => undefined);
      }
    } catch {
      /* best effort — the error redirect still clears the flow cookies */
    }
    return genericError();
  }

  // Mint the user-bound gate (embedding the nonce) and clear the one-time state.
  response.cookies.set(
    FLOW_GATE_COOKIE,
    createGateToken(getDashboardAuthFlowSecret(), { userId: user.id, purpose, nonce }),
    flowCookieOptions(GATE_TTL_SECONDS)
  );
  response.cookies.set(RECOVERY_STATE_COOKIE, "", { ...flowCookieOptions(0), maxAge: 0 });

  return response;
}
