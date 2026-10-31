import Link from "@/components/ui/LocaleLink";
import { Wordmark } from "@/components/brand/Logo";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function Footer({ locale }: { locale: Locale }) {
  const { site, products, markets } = getContent(locale);
  return (
    <footer data-theme="dark" className="bg-charcoal pb-8 pt-20 text-paper md:pt-28">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="subhead max-w-[14em]">{site.secondary}</p>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="link-line mt-6 inline-block">
                {contactEmail}
              </a>
            ) : null}
          </div>
          <FooterColumn title={site.footer.products} items={products.map((p) => ({ href: `/products/${p.slug}`, label: p.name }))} className="md:col-span-3" />
          <FooterColumn title={site.footer.markets} items={markets.map((m) => ({ href: `/markets/${m.slug}`, label: m.name }))} className="md:col-span-3" />
          <FooterColumn
            title="AUNZA"
            items={[...site.nav.filter((item) => !["/products", "/markets"].includes(item.href)), { href: "/quote", label: site.quoteLabel }]}
            className="md:col-span-2"
          />
        </div>

        <Wordmark className="mt-20 w-full text-paper md:mt-28" title="AUNZA" />

        <div className="mt-8 flex flex-col gap-3 border-t border-paper/15 pt-6 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
          <p className="label !text-paper/75">{site.tagline}</p>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-paper">{site.footer.legal}</Link>
            <span>© {new Date().getFullYear()} AUNZA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items, className }: { title: string; items: { href: string; label: string }[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="label text-paper/60">{title}</h2>
      <ul className="mt-5 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-[0.9375rem] text-paper/85 transition-colors hover:text-paper">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
