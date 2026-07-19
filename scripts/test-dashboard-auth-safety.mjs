#!/usr/bin/env node
// =============================================================================
// P04 dashboard auth/shell safety tests (dependency-free at runtime; uses the
// project's own `typescript` compiler to execute the REAL pure TS logic rather
// than asserting on regexes).
// =============================================================================

import { readFileSync, writeFileSync, mkdtempSync, existsSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

// Transpile a self-contained (import-free after type elision) TS module and
// import it so we exercise the ACTUAL source.
const tmp = mkdtempSync(join(tmpdir(), "p04-"));
async function loadTs(relPath) {
  const src = readFileSync(join(ROOT, relPath), "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const file = join(tmp, relPath.replace(/[\\/]/g, "_").replace(/\.ts$/, ".mjs"));
  writeFileSync(file, out);
  return import(pathToFileURL(file).href);
}

function readAll(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) readAll(p, acc);
    else if (/\.(ts|tsx|mjs)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

console.log("P04 dashboard auth/shell safety tests\n" + "-".repeat(60));

// ---------------------------------------------------------------------------
// 1. Redirect return-path validation (REAL logic).
// ---------------------------------------------------------------------------
const redirect = await loadTs("lib/auth/redirect.ts");
const S = (v) => redirect.safeDashboardReturnPath(v);
console.log("Return-path validation:");
assert("valid /dashboard accepted", S("/dashboard") === "/dashboard");
assert("valid /dashboard/products accepted", S("/dashboard/products") === "/dashboard/products");
assert("valid nested /dashboard/products/123 accepted", S("/dashboard/products/123") === "/dashboard/products/123");
assert("https://evil.example rejected", S("https://evil.example") === "/dashboard");
assert("//evil.example rejected", S("//evil.example") === "/dashboard");
assert("/\\evil.example (backslash) rejected", S("/\\evil.example") === "/dashboard");
assert("encoded external %2F%2Fevil rejected", S("%2F%2Fevil.example") === "/dashboard");
assert("encoded https rejected", S("https%3A%2F%2Fevil.example") === "/dashboard");
assert("control-char variant rejected", S("/dashboard/%09/x") === "/dashboard" || S("/dashboard\t") === "/dashboard");
assert("non-dashboard path rejected", S("/admin") === "/dashboard" && S("/") === "/dashboard");
assert("login loop rejected", S("/dashboard/login") === "/dashboard");
assert("callback loop rejected", S("/dashboard/auth/callback") === "/dashboard");
assert("update-password loop rejected", S("/dashboard/update-password") === "/dashboard");
assert("forbidden loop rejected", S("/dashboard/forbidden") === "/dashboard");
assert("query/hash stripped", S("/dashboard/products?x=1#y") === "/dashboard/products");
assert("non-string rejected", S(undefined) === "/dashboard" && S(123) === "/dashboard");
assert("loginPathWithReturn keeps safe return", redirect.loginPathWithReturn("/dashboard/products") === "/dashboard/login?returnTo=%2Fdashboard%2Fproducts");
assert("loginPathWithReturn drops external", redirect.loginPathWithReturn("https://evil.example") === "/dashboard/login");

// ---------------------------------------------------------------------------
// 2. Password policy (REAL logic).
// ---------------------------------------------------------------------------
const pw = await loadTs("lib/auth/password.ts");
console.log("\nPassword policy:");
assert("min length is 12", pw.MIN_PASSWORD_LENGTH === 12);
assert("11 chars rejected", pw.validateNewPassword("a".repeat(11), "a".repeat(11)).ok === false);
assert("12 matching chars accepted", pw.validateNewPassword("a".repeat(12), "a".repeat(12)).ok === true);
assert("mismatch rejected", pw.validateNewPassword("a".repeat(12), "b".repeat(12)).ok === false);

// ---------------------------------------------------------------------------
// 3. Role-aware navigation (REAL logic).
// ---------------------------------------------------------------------------
const nav = await loadTs("lib/auth/dashboard-nav.ts");
console.log("\nRole-aware navigation:");
const owner = nav.navForRole("owner").map((i) => i.href);
const admin = nav.navForRole("admin").map((i) => i.href);
const editor = nav.navForRole("editor").map((i) => i.href);
assert("owner sees Team", owner.includes("/dashboard/team"));
assert("admin does NOT see Team", !admin.includes("/dashboard/team"));
assert("editor does NOT see Team", !editor.includes("/dashboard/team"));
assert("all roles see content sections", ["/dashboard/products", "/dashboard/enquiries"].every((h) => admin.includes(h) && editor.includes(h)));
assert("only Overview is implemented in P04", nav.DASHBOARD_NAV.filter((i) => i.implemented).length === 1);
assert("isActiveNav exact for overview", nav.isActiveNav("/dashboard", "/dashboard") && !nav.isActiveNav("/dashboard", "/dashboard/products"));
assert("isActiveNav prefix for sections", nav.isActiveNav("/dashboard/products", "/dashboard/products/1"));

// ---------------------------------------------------------------------------
// 4. No public signup anywhere; no signUp() in dashboard runtime.
// ---------------------------------------------------------------------------
console.log("\nNo public signup:");
const runtimeFiles = [
  ...readAll(join(ROOT, "app", "dashboard")),
  ...readAll(join(ROOT, "lib", "auth")),
  ...readAll(join(ROOT, "components", "dashboard")),
  join(ROOT, "middleware.ts"),
  join(ROOT, "lib", "supabase", "server.ts"),
  join(ROOT, "lib", "supabase", "client.ts"),
].filter((f) => existsSync(f));
// Strip // line and /* */ block comments so explanatory prose (e.g. a comment
// in lib/supabase/server.ts noting it does NOT use the service-role key) cannot
// cause a false positive in the code scans below.
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}
const runtimeSrc = runtimeFiles.map((f) => stripComments(readFileSync(f, "utf8"))).join("\n");
assert("no signUp( call in dashboard runtime", !/\bsignUp\s*\(/.test(runtimeSrc));
assert("no /dashboard signup route", !existsSync(join(ROOT, "app", "dashboard", "(auth)", "signup")) && !existsSync(join(ROOT, "app", "dashboard", "signup")));
assert("login page has no signup link", !/sign[-\s]?up/i.test(readFileSync(join(ROOT, "app/dashboard/(auth)/login/page.tsx"), "utf8")));

// ---------------------------------------------------------------------------
// 5. No service-role key in dashboard runtime / client code.
// ---------------------------------------------------------------------------
console.log("\nNo service-role in dashboard runtime:");
assert("no SERVICE_ROLE / getSupabaseServiceRoleKey in dashboard runtime", !/SERVICE_ROLE|getSupabaseServiceRoleKey/i.test(runtimeSrc));
assert("dashboard shell uses only the request Supabase client", /createSupabaseServerClient/.test(runtimeSrc) && !/service_role/i.test(runtimeSrc));

// ---------------------------------------------------------------------------
// 6. Middleware is dashboard-scoped and uses getUser (not getSession).
// ---------------------------------------------------------------------------
console.log("\nMiddleware:");
const mw = readFileSync(join(ROOT, "middleware.ts"), "utf8");
assert("matcher is dashboard-only", /matcher:\s*\[[^\]]*"\/dashboard[^\]]*\]/.test(mw) && !/"\/\(\(\?!/.test(mw) && !/"\/:path/.test(mw));
assert("matcher contains no public/api/_next patterns", !/_next|api|sitemap|robots|\(en\)|\/ar/.test(mw.match(/matcher:[^]]*\]/)?.[0] || ""));
assert("uses getUser (verified), not getSession", /auth\.getUser\(\)/.test(mw) && !/auth\.getSession\(/.test(mw));
assert("update-password NOT in public auth paths", !/DASHBOARD_UPDATE_PASSWORD_PATH/.test(mw.match(/PUBLIC_AUTH_PATHS[^;]*?\);/s)?.[0] || ""));
assert("sets dashboard security headers", /X-Frame-Options|X-Content-Type-Options|Referrer-Policy/.test(mw));

// ---------------------------------------------------------------------------
// 7. Server-side authorization boundaries.
// ---------------------------------------------------------------------------
console.log("\nServer-side authorization:");
const protectedLayout = readFileSync(join(ROOT, "app/dashboard/(protected)/layout.tsx"), "utf8");
assert("protected layout enforces membership server-side", /requireDashboardMember\(\)/.test(protectedLayout));
const teamPage = readFileSync(join(ROOT, "app/dashboard/(protected)/team/page.tsx"), "utf8");
assert("Team route is owner-only server-side", /requireDashboardRole\("owner"\)/.test(teamPage));
const dash = readFileSync(join(ROOT, "lib/auth/dashboard.ts"), "utf8");
assert("sign-in path updated to /dashboard/login", /DASHBOARD_SIGN_IN_PATH\s*=\s*DASHBOARD_LOGIN_PATH/.test(dash));
assert("auth state fails closed (unauthenticated vs forbidden)", /getDashboardAuthState/.test(dash) && /"forbidden"/.test(dash) && /"unauthenticated"/.test(dash));

// ---------------------------------------------------------------------------
// 8. Missing-env fail-closed + generic errors (no token/secret in URLs).
// ---------------------------------------------------------------------------
console.log("\nMissing-env & generic errors:");
const actions = readFileSync(join(ROOT, "lib/auth/dashboard-actions.ts"), "utf8");
assert("actions gate on hasSupabasePublicConfig", /hasSupabasePublicConfig\(\)/.test(actions));
assert("login shows generic invalid-credentials", /Invalid email or password/.test(readFileSync(join(ROOT, "app/dashboard/(auth)/login/page.tsx"), "utf8")));
assert("forgot-password always same response", /state=sent/.test(actions));
assert("callback never puts tokens in redirect", !/access_token|refresh_token/.test(readFileSync(join(ROOT, "app/dashboard/auth/callback/route.ts"), "utf8")));
assert("no password logged", !/console\.[a-z]+\([^)]*password/i.test(actions));

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} P04 safety test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All P04 dashboard auth/shell safety tests passed.");
