import type { Metadata } from "next";
import Link from "@/components/ui/LocaleLink";
import { Arrow } from "@/components/ui/ProductIcon";
import { Asset } from "@/components/ui/Asset";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const customMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).customProjects.meta, alternates: alternates("/custom-projects", locale) });

export function CustomProjectsView({ locale }: Props) {
  const c = getContent(locale).customProjects;
  return (
    <>
      <section data-theme="dark" className="bg-charcoal pb-20 pt-[calc(var(--header-h)+3rem)] text-paper md:pb-32 md:pt-[calc(var(--header-h)+5rem)]">
        <div className="wrap">
          <SectionLabel className="text-paper/60">{c.label}</SectionLabel>
          <Lines as="h1" lines={c.lines} className="display mt-6 !text-[clamp(2.75rem,9.6vw,10.5rem)]" />
          <div className="mt-10 grid gap-6 md:grid-cols-12 md:items-end">
            <p data-reveal className="lede text-paper/80 md:col-span-7">{c.text}</p>
            <div data-reveal className="md:col-span-5 md:text-right">
              <Link href="/quote?category=custom-products" className="btn btn-paper w-full sm:w-auto">
                {c.cta} <Arrow />
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-12 gap-4 md:mt-24 md:gap-6">
            <div data-reveal="mask" className="relative col-span-12 aspect-[3/2] overflow-hidden md:col-span-8">
              <div className="absolute inset-0"><Asset id="P09" priority sizes="(min-width: 768px) 66vw, 100vw" /></div>
            </div>
            <div data-reveal="mask" className="relative col-span-6 aspect-square overflow-hidden md:col-span-4 md:mt-32">
              <div className="absolute inset-0"><Asset id="C03" sizes="(min-width: 768px) 33vw, 50vw" /></div>
            </div>
            <div data-reveal="mask" className="relative col-span-6 aspect-square overflow-hidden md:hidden">
              <div className="absolute inset-0"><Asset id="C01" sizes="50vw" /></div>
            </div>
          </div>
        </div>
      </section>

      <section data-theme="light" className="bg-sand py-20 md:py-32">
        <div className="wrap">
          <SectionLabel>{c.starts.label}</SectionLabel>
          <ul className="mt-10 grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-14">
            {c.starts.items.map((item) => (
              <li key={item.title} data-reveal className="border-t border-charcoal/25 pt-5">
                <h2 className="headline !text-[clamp(2rem,4.6vw,4.75rem)]">{item.title}</h2>
                <p className="mt-3 max-w-[28em] text-charcoal/75">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-theme="light" className="bg-paper py-20 md:py-32">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel>{c.stepsLabel}</SectionLabel>
            <div data-reveal="mask" className="relative mt-8 aspect-[3/2] overflow-hidden">
              <div className="absolute inset-0"><Asset id="D02" sizes="(min-width: 768px) 40vw, 100vw" /></div>
            </div>
          </div>
          <ol className="md:col-span-6 md:col-start-7">
            {c.steps.map((step, i) => (
              <li key={step} data-reveal className="flex gap-6 border-t border-charcoal/20 py-6 last:border-b">
                <span className="text-sm tabular-nums text-charcoal/55">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.02em]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-theme="light" className="bg-terracotta py-20 text-charcoal md:py-28">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 data-reveal className="headline max-w-[11em]">{c.closing}</h2>
          <Link data-reveal href="/quote?category=custom-products" className="btn btn-ink w-full shrink-0 sm:w-auto">
            {c.cta} <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
