"use client";

import { useEffect } from "react";

// Capabilities content now lives inside the merged /private-label page.
// This route redirects there (#capabilities). Static export has no server, so
// the redirect runs client-side with a visible no-JS fallback link.
const TARGET = "/private-label/#capabilities";

export default function CapabilitiesRedirect() {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
      <p className="text-sm text-stone">
        Redirecting to{" "}
        <a href={TARGET} className="font-semibold text-gold underline">
          Private Label — Capabilities
        </a>
        …
      </p>
    </main>
  );
}
