import type { Metadata } from "next";
import Link from "@/components/ui/LocaleLink";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { ContactForm } from "@/components/forms/ContactForm";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const contactMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).contact.meta, alternates: alternates("/contact", locale) });

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function ContactView({ locale }: Props) {
  const { contact: c, site, form } = getContent(locale);
  return (
    <section data-theme="light" className="min-h-svh bg-sand pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="wrap grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <SectionLabel>{c.label}</SectionLabel>
          <Lines as="h1" lines={c.lines} className="headline mt-6" />
          <p data-reveal className="lede mt-8">{c.lede}</p>
          {email ? (
            <p data-reveal className="mt-6">
              <a href={`mailto:${email}`} className="link-line">{email}</a>
            </p>
          ) : null}
          <div data-reveal className="mt-10 border-t border-charcoal/20 pt-6">
            <p className="max-w-[26em] text-charcoal/75">{c.alternative}</p>
            <Link href="/quote" className="btn btn-line-dark mt-5 w-full sm:w-auto">
              {site.quoteLabel} <Arrow />
            </Link>
          </div>
        </div>
        <div data-reveal className="md:col-span-5 md:col-start-8">
          <ContactForm copy={{ ...form.contact, done: form.contact.done("{email}") }} locale={locale} />
        </div>
      </div>
    </section>
  );
}
