import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "@/app/globals.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { TransitionLayer } from "@/components/motion/TransitionLayer";
import { getContent } from "@/content";
import { SITE_URL, alternates, localePath, type Locale } from "@/i18n/config";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = { themeColor: "#a8937b" };

export function rootMetadata(locale: Locale): Metadata {
  const { site } = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.metaTitle, template: "%s — AUNZA" },
    description: site.description,
    alternates: alternates("/", locale),
    openGraph: { siteName: "AUNZA", type: "website", locale: locale === "es" ? "es_ES" : "en_US", url: localePath(locale, "/") },
    twitter: { card: "summary_large_image" },
  };
}

/** The document for one language. Each language has its own root layout, so `lang` is always right in the HTML. */
export function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { site } = getContent(locale);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AUNZA",
    url: SITE_URL,
    slogan: site.tagline,
    description: site.description,
  };
  return (
    <html lang={locale} className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Elements are only hidden for entrance motion once we know JS is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </head>
      <body>
        <Header site={{ nav: site.nav, quoteLabel: site.quoteLabel, a11y: site.a11y }} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <MotionRoot />
        <TransitionLayer />
      </body>
    </html>
  );
}
