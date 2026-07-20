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

import { createHash, createHmac, timingSafeEqual, randomBytes } from "node:crypto";

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

// Reject blank, short, or obvious placeholder/example secrets. A real secret
// must carry at least 32 characters of entropy (48 random bytes recommended).
const WEAK_SECRET_MARKERS = [
  "example",
  "changeme",
  "change-me",
  "change_me",
  "placeholder",
  "your-secret",
  "your_secret",
  "yoursecret",
  "secret-here",
  "replace-me",
  "replace_me",
  "todo",
  "openssl rand",
];

/** True when the value is a strong-enough flow secret. Same rules are used by
 * both hasDashboardAuthFlowSecret() and getDashboardAuthFlowSecret(). */
export function isValidFlowSecret(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const s = value.trim();
  if (s.length < 32) return false;
  const lower = s.toLowerCase();
  if (WEAK_SECRET_MARKERS.some((m) => lower.includes(m))) return false;
  // Reject a single repeated character (e.g. "aaaa…").
  if (/^(.)\1+$/.test(s)) return false;
  return true;
}

/** Constant-time string equality (false on length mismatch). */
export function constantTimeEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** SHA-256 hex digest of a nonce. Only the DIGEST is ever persisted server-side;
 * the raw nonce lives only inside the HMAC-signed gate cookie. */
export function hashNonce(nonce: string): string {
  return createHash("sha256").update(nonce).digest("hex");
}

/** Create a signed gate token for a specific user + purpose, embedding an
 * explicit single-use `nonce` (whose hash is registered in the database). */
export function createGateToken(
  secret: string,
  opts: { userId: string; purpose: FlowPurpose; nonce: string; ttlSeconds?: number; now?: number }
): string {
  const nowMs = opts.now ?? Date.now();
  const payload: GatePayload = {
    uid: opts.userId,
    p: opts.purpose,
    exp: Math.floor(nowMs / 1000) + (opts.ttlSeconds ?? GATE_TTL_SECONDS),
    n: opts.nonce,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(secret, body)}`;
}

export type GateVerification =
  | { ok: true; purpose: FlowPurpose; nonce: string }
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
  if (typeof payload.n !== "string" || payload.n.length === 0) return { ok: false, reason: "malformed" };
  const nowMs = opts.now ?? Date.now();
  if (typeof payload.exp !== "number" || payload.exp * 1000 <= nowMs) {
    return { ok: false, reason: "expired" };
  }
  if (payload.uid !== opts.userId) return { ok: false, reason: "user-mismatch" };
  return { ok: true, purpose: payload.p, nonce: payload.n };
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
