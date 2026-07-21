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
import { buildCallbackErrorCookies } from "@/lib/auth/callback-cookies";

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

  // Every Supabase cookie mutation the SSR client makes during this request is
  // captured here. On SUCCESS these are replayed so the legitimate session cookie
  // is preserved. On FAILURE they are NOT replayed — see genericError below.
  const cookieWrites: { name: string; value: string; options: Record<string, unknown> }[] = [];

  // Build a generic login error that FAILS CLOSED on cookies. A callback may have
  // authenticated (exchangeCodeForSession/verifyOtp writes a session cookie) and
  // then failed later (e.g. nonce registration). The returned error response must
  // never carry a non-empty Supabase session cookie, and its security must not
  // depend on signOut succeeding. buildCallbackErrorCookies turns every relevant
  // Supabase auth cookie — recorded during this request OR already present on the
  // request (including chunked `.0/.1` and the PKCE verifier) — into an explicit
  // deletion, and always clears the flow gate + one-time recovery state. Unrelated
  // application cookies are left untouched.
  const genericError = () => {
    const errorResponse = NextResponse.redirect(
      new URL(`${DASHBOARD_LOGIN_PATH}?error=auth`, origin)
    );
    const deletions = buildCallbackErrorCookies({
      recordedWrites: cookieWrites,
      requestCookieNames: request.cookies.getAll().map((c) => c.name),
    });
    for (const { name, value, options } of deletions) {
      errorResponse.cookies.set(name, value, options);
    }
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
    // Fail closed. Best-effort revoke the just-created session server-side, and
    // inspect the returned {error} (never expose it) so a failed local sign-out
    // is not silently ignored. Crucially, the returned response's security does
    // NOT depend on this succeeding: genericError independently deletes every
    // Supabase auth cookie (see buildCallbackErrorCookies), so no session cookie
    // survives even if signOut errors or writes no deletion.
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) {
        await supabase.auth.signOut({ scope: "global" }).catch(() => undefined);
      }
    } catch {
      /* best effort — the error response deletes the session cookies regardless */
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
