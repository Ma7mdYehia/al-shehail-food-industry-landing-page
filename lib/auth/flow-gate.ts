// Short-lived, tamper-resistant, server-verified authorization for the
// password-set (recovery/invite) flow. A signed "gate" proves that THIS exact
// Auth user just completed a recovery or invite verification — a normal
// password session or a `type=recovery` query parameter alone must NOT pass.
//
// The gate is an HMAC-SHA256-signed token bound to { user id, purpose, expiry,
// high-entropy nonce }. It is stored ONLY in an HttpOnly cookie and verified
// server-side with a timing-safe comparison, using a dedicated server-only
// secret (DASHBOARD_AUTH_FLOW_SECRET) that is never exposed to the client.
//
// Pure crypto (node:crypto) so it is unit-testable with a synthetic secret,
// with no environment or network dependency.

import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

export const FLOW_GATE_COOKIE = "ds_flow_gate";
export const RECOVERY_STATE_COOKIE = "ds_recovery_state";
export const GATE_TTL_SECONDS = 15 * 60; // 15 minutes
export const STATE_TTL_SECONDS = 15 * 60;

export type FlowPurpose = "recovery" | "invite";
export const FLOW_PURPOSES: readonly FlowPurpose[] = ["recovery", "invite"];

type GatePayload = { uid: string; p: FlowPurpose; exp: number; n: string };

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(secret: string, body: string): string {
  return b64url(createHmac("sha256", secret).update(body).digest());
}

/** High-entropy random token (base64url) for state nonces. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Constant-time string equality (false on length mismatch). */
export function constantTimeEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Create a signed gate token for a specific user + purpose. */
export function createGateToken(
  secret: string,
  opts: { userId: string; purpose: FlowPurpose; ttlSeconds?: number; now?: number }
): string {
  const nowMs = opts.now ?? Date.now();
  const payload: GatePayload = {
    uid: opts.userId,
    p: opts.purpose,
    exp: Math.floor(nowMs / 1000) + (opts.ttlSeconds ?? GATE_TTL_SECONDS),
    n: randomToken(16),
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(secret, body)}`;
}

export type GateVerification =
  | { ok: true; purpose: FlowPurpose }
  | { ok: false; reason: "malformed" | "bad-signature" | "expired" | "user-mismatch" | "bad-purpose" };

/** Verify a gate token: signature (timing-safe), expiry, purpose, and that it is
 * bound to `userId`. Returns a generic failure reason (never throws). */
export function verifyGateToken(
  secret: string,
  token: unknown,
  opts: { userId: string; now?: number }
): GateVerification {
  if (typeof token !== "string") return { ok: false, reason: "malformed" };
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: "malformed" };
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(secret, body);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { ok: false, reason: "bad-signature" };
  }

  let payload: GatePayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (!payload || typeof payload !== "object" || typeof payload.uid !== "string") {
    return { ok: false, reason: "malformed" };
  }
  if (!FLOW_PURPOSES.includes(payload.p)) return { ok: false, reason: "bad-purpose" };
  const nowMs = opts.now ?? Date.now();
  if (typeof payload.exp !== "number" || payload.exp * 1000 <= nowMs) {
    return { ok: false, reason: "expired" };
  }
  if (payload.uid !== opts.userId) return { ok: false, reason: "user-mismatch" };
  return { ok: true, purpose: payload.p };
}

/** Cookie options for the gate/state cookies. HttpOnly always; Secure in
 * production; SameSite=Lax; scoped to /dashboard. */
export function flowCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/dashboard",
    maxAge: maxAgeSeconds,
  };
}
