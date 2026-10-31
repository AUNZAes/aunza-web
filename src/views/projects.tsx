import type { Metadata } from "next";
import Link from "@/components/ui/LocaleLink";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const projectsMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).projects.meta, alternates: alternates("/projects", locale) });

export function ProjectsView({ locale }: Props) {
  const c = getContent(locale).projects;
  return (
    <>
      <section data-theme="light" className="bg-paper pb-16 pt-[calc(var(--header-h)+3rem)] md:pb-24 md:pt-[calc(var(--header-h)+5rem)]">
        <div className="wrap">
          <SectionLabel>{c.label}</SectionLabel>
          <Lines as="h1" lines={c.lines} className="display mt-6 !text-[clamp(2.75rem,9.6vw,10.5rem)]" />
          <p data-reveal className="lede mt-8">{c.text}</p>
        </div>
      </section>

      {c.items.map((p, i) => (
        <section key={p.id} id={p.id} data-theme="light" className={`scroll-mt-[var(--header-h)] py-14 md:py-24 ${i % 2 ? "bg-sand" : "bg-paper"}`}>
          <div className="wrap grid items-center gap-8 md:grid-cols-12 md:gap-6">
            <div data-reveal="mask" className={`relative aspect-[3/2] overflow-hidden md:col-span-8 ${i % 2 ? "md:order-2" : ""}`}>
              <div className="absolute inset-0"><Asset id={p.image} priority={i === 0} sizes="(min-width: 768px) 66vw, 100vw" /></div>
            </div>
            <div className={`md:col-span-4 ${i % 2 ? "md:order-1 md:pr-6" : "md:pl-6"}`}>
              <p data-reveal className="label text-charcoal/70">{p.name}</p>
              <h2 data-reveal className="subhead mt-4 font-medium">{p.headline}</h2>
              <p data-reveal className="mt-4 text-charcoal/80">{p.text}</p>
              <ul className="mt-6">
                {p.items.map((item) => (
                  <li key={item} data-reveal className="border-t border-charcoal/20 py-2.5 text-[0.9375rem] last:border-b">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section data-theme="light" className="bg-terracotta py-20 text-charcoal md:py-28">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 data-reveal className="headline max-w-[11em]">{c.cta.title}</h2>
          <Link data-reveal href={c.cta.href} className="btn btn-ink w-full shrink-0 sm:w-auto">
            {c.cta.label} <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
