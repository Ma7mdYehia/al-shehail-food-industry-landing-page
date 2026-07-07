"use client";

import { useEffect } from "react";

// Quality & Certifications content lives inside the merged /ar/private-label page.
const TARGET = "/ar/private-label/#quality";

export default function QualityRedirect() {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
      <p className="text-sm text-stone">
        جارٍ التحويل إلى{" "}
        <a href={TARGET} className="font-semibold text-gold underline">
          العلامة الخاصة — الجودة
        </a>
        …
      </p>
    </main>
  );
}
