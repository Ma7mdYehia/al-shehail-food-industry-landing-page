// Locale primitives for the bilingual (English default + Arabic) site.
// Routing is filesystem-based (route groups): English pages live under
// app/(en)/... at unprefixed URLs, Arabic mirrors live under app/ar/...
// There is NO middleware (the site is a static export), so locale is a
// hardcoded constant per page and threaded through components as a prop.

export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];

export const defaultLocale: Locale = "en";

/** A text value that exists in both languages. */
export type Localized<T = string> = { en: T; ar: T };

/** Resolve a bilingual value for the given locale. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export const dir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const htmlLang: Record<Locale, string> = {
  en: "en",
  ar: "ar",
};

/** The opposite locale — used by the header language switcher. */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/**
 * Given the current pathname and the target locale, return the equivalent
 * path in that locale. Arabic URLs are the English URL prefixed with `/ar`.
 * `/` <-> `/ar`, `/services/distribution` <-> `/ar/services/distribution`.
 * The site builds 1:1 mirrors, so the target route always exists.
 */
export function localizedPath(pathname: string, target: Locale): string {
  // Normalize: drop any trailing slash (except root) so logic is uniform.
  let path = pathname || "/";
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  // Strip an existing /ar prefix to get the canonical English path.
  const isArabic = path === "/ar" || path.startsWith("/ar/");
  const enPath = isArabic ? path.replace(/^\/ar/, "") || "/" : path;

  if (target === "en") return enPath;
  return enPath === "/" ? "/ar" : `/ar${enPath}`;
}

/**
 * Prefix an internal href with the locale segment. English hrefs are stored
 * canonically (unprefixed) in the data modules; Arabic pages call this to point
 * links at their `/ar/...` mirror. Anchors (#x) and external URLs pass through.
 */
export function localeHref(href: string, locale: Locale): string {
  if (locale === "en") return href;
  if (!href.startsWith("/")) return href;
  return href === "/" ? "/ar" : `/ar${href}`;
}
