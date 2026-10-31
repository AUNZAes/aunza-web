import Link from "@/components/ui/LocaleLink";
import type { ReactNode } from "react";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { getContent, getProduct } from "@/content";
import type { DetailPage } from "@/content/types";
import type { Locale } from "@/i18n/config";

/** Splits a headline into two balanced lines for the masked entrance. */
function twoLines(text: string) {
  const words = text.split(" ");
  const mid = Math.ceil(words.length / 2);
  return words.length < 3 ? [text] : [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

type DetailViewProps = {
  locale: Locale;
  page: DetailPage;
  kindLabel: string;
  kindHref: string;
  quoteHref: string;
  /** Interactive sequence placed right after the hero. */
  experience?: ReactNode;
};

export function DetailView({ locale, page, kindLabel, kindHref, quoteHref, experience }: DetailViewProps) {
  const { site, detail } = getContent(locale);
  const related = page.related.map((slug) => getProduct(slug, locale)).filter((p) => p && p.slug !== page.slug);

  return (
    <>
      <section data-theme="light" className="bg-paper pt-[calc(var(--header-h)+2rem)] md:pt-[calc(var(--header-h)+4rem)]">
        <div className="wrap">
          <nav aria-label="Breadcrumb" data-reveal className="label flex gap-3 text-charcoal/75">
            <Link href={kindHref} className="hover:text-charcoal">{kindLabel}</Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-charcoal">{page.name}</span>
          </nav>
          <Lines as="h1" lines={twoLines(page.headline)} className="headline mt-6 !text-[clamp(2.75rem,8.4vw,9rem)]" />
          <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-12 md:items-end">
            <p data-reveal className="lede md:col-span-7">{page.intro}</p>
            <div data-reveal className="md:col-span-5 md:text-right">
              <Link href={quoteHref} className="btn btn-ink w-full sm:w-auto">
                {site.quoteLabel} <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 md:mt-16">
          <div data-scrub-clip className="relative aspect-[4/3] max-h-[90svh] w-full overflow-hidden md:aspect-[16/9]">
            <Asset id={page.hero} priority sizes="100vw" />
          </div>
        </div>
      </section>

      {experience}

      <section data-theme="light" className="bg-paper py-20 md:py-32">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel>{detail.relevant.label}</SectionLabel>
            <p data-reveal className="mt-4 max-w-[22em] text-charcoal/70">
              {detail.relevant.note}
            </p>
          </div>
          <ul className="md:col-span-8">
            {page.products.map((p) => (
              <li key={p.name} data-reveal className="flex flex-col justify-between gap-1 border-t border-charcoal/20 py-5 last:border-b sm:flex-row sm:items-baseline sm:gap-6">
                <span className="text-[clamp(1.375rem,2.4vw,2.25rem)] font-medium leading-tight tracking-[-0.03em]">{p.name}</span>
                {p.note ? <span className="text-[0.9375rem] text-charcoal/65 sm:text-right">{p.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-theme="light" className="bg-sand py-20 md:py-32">
        <div className="wrap grid items-center gap-12 md:grid-cols-12">
          <div data-reveal="mask" className="relative aspect-square overflow-hidden md:col-span-6">
            <div className="absolute inset-0">
              <Asset id={page.detail} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <SectionLabel>{detail.customization.label}</SectionLabel>
            <ul className="mt-6 flex flex-wrap gap-2">
              {page.customization.map((c) => (
                <li key={c.name} data-reveal className="rounded-full border border-charcoal/30 px-4 py-2 text-[0.9375rem]">
                  {c.name}
                </li>
              ))}
            </ul>
            <p data-reveal className="mt-6 text-[0.9375rem] text-charcoal/65">
              {detail.customization.note}
            </p>
          </div>
        </div>
      </section>

      <section data-theme="dark" className="bg-charcoal py-20 text-paper md:py-32">
        <div className="wrap">
          <SectionLabel className="text-paper/60">{detail.applications}</SectionLabel>
          <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
            {page.applications.map((a, i) => (
              <li key={a.name} data-reveal className="border-t border-paper/20 pt-5">
                <span className="text-sm tabular-nums text-paper/55">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="subhead mt-4">{a.name}</h2>
                <p className="mt-3 max-w-[26em] text-paper/75">{a.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-theme="light" className="bg-paper py-20 md:py-32">
        <div className="wrap">
          <SectionLabel>{detail.related}</SectionLabel>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <li key={p!.slug}>
                <Link href={`/products/${p!.slug}`} data-reveal className="group block">
                  <div className="card-media relative aspect-[3/2] overflow-hidden">
                    <Asset id={p!.hero} sizes="(min-width: 768px) 33vw, 100vw" alt="" />
                  </div>
                  <h2 className="mt-4 flex items-center justify-between gap-4 text-xl font-medium tracking-[-0.02em]">
                    {p!.name}
                    <Arrow className="w-5 shrink-0 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:translate-x-1.5" />
                  </h2>
                  <p className="mt-1 text-[0.9375rem] text-charcoal/70">{p!.short}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuoteBand locale={locale} href={quoteHref} name={page.name} />
    </>
  );
}

export function QuoteBand({ locale, href = "/quote", name }: { locale: Locale; href?: string; name?: string }) {
  const { site, detail } = getContent(locale);
  return (
    <section data-theme="light" className="bg-terracotta py-20 text-charcoal md:py-28">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 data-reveal className="headline max-w-[11em] !text-[clamp(2.25rem,5.4vw,5.6rem)]">
          {name ? detail.band.named(name) : detail.band.generic}
        </h2>
        <Link data-reveal href={href} className="btn btn-ink w-full shrink-0 sm:w-auto">
          {site.quoteLabel} <Arrow />
        </Link>
      </div>
    </section>
  );
}
