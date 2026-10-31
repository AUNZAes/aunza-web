export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Spanish lives at the root and English under /en. Content always stores the unprefixed path. */
export function localePath(locale: Locale, path: string) {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export const localeOf = (pathname: string): Locale => (pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es");

export const stripLocale = (pathname: string) => (localeOf(pathname) === "en" ? pathname.slice(3) || "/" : pathname);

/** Canonical and hreflang entries for a path in a given language. */
export function alternates(path: string, locale: Locale) {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      es: localePath("es", path),
      "x-default": localePath(defaultLocale, path),
    },
  };
}
