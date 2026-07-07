"use client";

import { useEffect } from "react";

// Capabilities content lives inside the merged /ar/private-label page.
const TARGET = "/ar/private-label/#capabilities";

export default function CapabilitiesRedirect() {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
      <p className="text-sm text-stone">
        جارٍ التحويل إلى{" "}
        <a href={TARGET} className="font-semibold text-gold underline">
          العلامة الخاصة — القدرات
        </a>
        …
      </p>
    </main>
  );
}
