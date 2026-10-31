import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { SITE_URL, localePath, locales } from "@/i18n/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { markets, products } = getContent("en");
  const paths = [
    "/",
    "/products",
    "/markets",
    "/projects",
    "/custom-projects",
    "/christmas",
    "/about",
    "/contact",
    "/quote",
    ...products.map((p) => `/products/${p.slug}`),
    ...markets.map((m) => `/markets/${m.slug}`),
  ];
  const url = (locale: (typeof locales)[number], path: string) => `${SITE_URL}${localePath(locale, path).replace(/\/?$/, "/")}`;
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: url(locale, path),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: { en: url("en", path), es: url("es", path) } },
    })),
  );
}
