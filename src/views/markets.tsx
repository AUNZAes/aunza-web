import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { DetailView, QuoteBand } from "@/components/detail/DetailView";
import { IndexGrid } from "@/components/detail/IndexGrid";
import { getMarket } from "@/content";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };
const slugsOf = (list: { slug: string }[]) => list.map(({ slug }) => ({ slug }));

export const marketsMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).pages.markets.meta, alternates: alternates("/markets", locale) });

export function MarketsView({ locale }: Props) {
  const { home, markets, pages } = getContent(locale);
  return (
    <>
      <section data-theme="light" className="bg-paper pb-20 pt-[calc(var(--header-h)+3rem)] md:pb-32 md:pt-[calc(var(--header-h)+5rem)]">
        <div className="wrap">
          <SectionLabel>{pages.markets.label}</SectionLabel>
          <Lines as="h1" lines={home.markets.lines} className="display mt-6 !text-[clamp(2.9rem,10.5vw,11.5rem)]" />
          <p data-reveal className="lede mt-8">{home.markets.text}</p>
          <div className="mt-16 md:mt-24">
            <IndexGrid items={markets} base="/markets" />
          </div>
        </div>
      </section>
      <QuoteBand locale={locale} />
    </>
  );
}

export const marketParams = () => slugsOf(getContent("en").markets);

export function marketMetadata(slug: string, locale: Locale): Metadata {
  const market = getMarket(slug, locale);
  if (!market) return {};
  return {
    title: getContent(locale).detail.marketTitle(market.name),
    description: `${market.short} ${market.who}`,
    alternates: alternates(`/markets/${market.slug}`, locale),
  };
}

export function MarketView({ slug, locale }: Props & { slug: string }) {
  const market = getMarket(slug, locale);
  if (!market) notFound();
  return <DetailView locale={locale} page={market} kindLabel={getContent(locale).pages.markets.label} kindHref="/markets" quoteHref={`/quote?industry=${market.slug}`} />;
}
