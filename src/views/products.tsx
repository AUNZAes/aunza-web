import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { DetailView, QuoteBand } from "@/components/detail/DetailView";
import { IndexGrid } from "@/components/detail/IndexGrid";
import { PackagingExperience } from "@/components/products/PackagingExperience";
import { ApparelExperience } from "@/components/products/ApparelExperience";
import { getProduct } from "@/content";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };
const slugsOf = (list: { slug: string }[]) => list.map(({ slug }) => ({ slug }));

export const productsMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).pages.products.meta, alternates: alternates("/products", locale) });

export function ProductsView({ locale }: Props) {
  const { home, products, pages, experiences } = getContent(locale);
  return (
    <>
      <section data-theme="light" className="bg-paper pb-20 pt-[calc(var(--header-h)+3rem)] md:pb-32 md:pt-[calc(var(--header-h)+5rem)]">
        <div className="wrap">
          <SectionLabel>{pages.products.label}</SectionLabel>
          <Lines as="h1" lines={home.collections.lines} className="display mt-6 !text-[clamp(2.9rem,10.5vw,11.5rem)]" />
          <p data-reveal className="lede mt-8">{home.collections.text}</p>
          <div className="mt-16 md:mt-24">
            <IndexGrid items={products} base="/products" />
          </div>
        </div>
      </section>
      <PackagingExperience copy={experiences.packaging} />
      <ApparelExperience copy={apparelCopy(locale)} />
      <QuoteBand locale={locale} href="/quote?category=custom-products" />
    </>
  );
}

/** Functions can't cross to a client component, so the garment label is resolved into a template. */
function apparelCopy(locale: Locale) {
  const { apparel } = getContent(locale).experiences;
  return { ...apparel, garment: apparel.garment("{colour}") };
}

export const productParams = () => slugsOf(getContent("en").products);

export function productMetadata(slug: string, locale: Locale): Metadata {
  const product = getProduct(slug, locale);
  if (!product) return {};
  return {
    title: getContent(locale).detail.productTitle(product.name),
    description: product.short,
    alternates: alternates(`/products/${product.slug}`, locale),
  };
}

export function ProductView({ slug, locale }: Props & { slug: string }) {
  const { pages, experiences } = getContent(locale);
  const product = getProduct(slug, locale);
  if (!product) notFound();
  const experience = slug === "packaging" ? <PackagingExperience copy={experiences.packaging} /> : slug === "apparel" ? <ApparelExperience copy={apparelCopy(locale)} /> : undefined;
  return <DetailView locale={locale} page={product} kindLabel={pages.products.label} kindHref="/products" quoteHref={`/quote?category=${product.slug}`} experience={experience} />;
}
