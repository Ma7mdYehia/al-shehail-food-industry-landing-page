import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabasePublicConfig, getSupabasePublicConfig } from "@/lib/env/public";
import {
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_FORGOT_PASSWORD_PATH,
  DASHBOARD_FORBIDDEN_PATH,
  DASHBOARD_AUTH_CALLBACK_PATH,
  loginPathWithReturn,
} from "@/lib/auth/redirect";

// Session-refresh middleware scoped ONLY to /dashboard routes (see `matcher`).
// It refreshes the Supabase auth cookies and does an EARLY unauthenticated
// redirect for protected pages, but it is NOT the final authorization boundary —
// the protected server layout still enforces dashboard membership and role.
// Public locale routes, APIs, images, sitemap, robots, and static assets are
// never matched, so the public website is unaffected.

// Paths reachable WITHOUT an authenticated session (no forced login redirect).
// `/dashboard/update-password` is intentionally excluded: it requires a valid
// recovery/invite session, so an unauthenticated visitor is sent to login.
const PUBLIC_AUTH_PATHS = new Set([
  DASHBOARD_LOGIN_PATH,
  DASHBOARD_FORGOT_PASSWORD_PATH,
  DASHBOARD_FORBIDDEN_PATH,
  DASHBOARD_AUTH_CALLBACK_PATH,
]);

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  // Scoped to dashboard responses only (middleware matcher). Conservative set —
  // no CSP here so nothing on the public site or the dashboard breaks.
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function middleware(request: NextRequest) {
  const path = normalizePath(request.nextUrl.pathname);
  const isAuthPath = PUBLIC_AUTH_PATHS.has(path);

  // Fail closed but gracefully: without Supabase config there is no session to
  // refresh. Let the request through (the server layout redirects protected
  // pages to login, which renders a "not configured yet" message on submit).
  if (!hasSupabasePublicConfig()) {
    return applySecurityHeaders(NextResponse.next());
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const { url, anonKey } = getSupabasePublicConfig();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Use getUser() (verified against Supabase Auth), NOT getSession().
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // Early redirect for protected pages only. Auth pages are always reachable.
  if (!user && !isAuthPath) {
    const loginUrl = request.nextUrl.clone();
    const target = loginPathWithReturn(path);
    const [pathname, query] = target.split("?");
    loginUrl.pathname = pathname;
    loginUrl.search = query ? `?${query}` : "";
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(response);
}

export const config = {
  // Dashboard-only. Public routes, API, _next assets, images, sitemap, and
  // robots are never matched.
  matcher: ["/dashboard", "/dashboard/:path*"],
};
