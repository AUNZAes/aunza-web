"use client";

import { usePathname } from "next/navigation";
import { localeOf, localePath, locales, stripLocale } from "@/i18n/config";

const NAMES = { en: "English", es: "Español" } as const;

/** A small two-way pill. Each option is a real link to the same page in that language, and keeps the query string. */
export function LanguageSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const current = localeOf(pathname);
  const path = stripLocale(pathname);

  return (
    <nav aria-label={label} className="flex h-10 shrink-0 items-center rounded-full border border-current p-[3px]">
      {locales.map((locale) => {
        const active = locale === current;
        const href = localePath(locale, path);
        return (
          <a
            key={locale}
            href={href}
            lang={locale}
            hrefLang={locale}
            title={NAMES[locale]}
            aria-label={NAMES[locale]}
            aria-current={active ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (!active) window.location.assign(href + window.location.search + window.location.hash);
            }}
            className={`flex h-full min-w-[2.15rem] items-center justify-center rounded-full px-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,opacity] duration-300 ${
              active ? "lang-active" : "opacity-65 hover:opacity-100"
            }`}
          >
            {locale}
          </a>
        );
      })}
    </nav>
  );
}
