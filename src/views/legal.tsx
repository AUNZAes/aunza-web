import type { Metadata } from "next";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const legalMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).legal.meta, alternates: alternates("/legal", locale), robots: { index: false } });

export function LegalView({ locale }: Props) {
  const c = getContent(locale).legal;
  return (
    <section data-theme="light" className="bg-paper pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="wrap max-w-[52rem]">
        <h1 className="headline">{c.title}</h1>
        {/* Stays visible until the registered company details replace the placeholder text. */}
        <p className="mt-8 border-l-2 border-terracotta pl-4 text-charcoal/80">{c.draft}</p>
        <div className="mt-10 space-y-8 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-[-0.02em] [&_p]:mt-3 [&_p]:text-charcoal/80">
          {c.sections.map((s) => (
            <div key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
