import type { Metadata } from "next";
import { QuoteBand } from "@/components/detail/DetailView";
import { Asset } from "@/components/ui/Asset";
import { ScrubWords, SectionLabel } from "@/components/ui/Text";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const aboutMetadata = (locale: Locale): Metadata => {
  const c = getContent(locale).about;
  return { title: c.meta.title, description: c.lead, alternates: alternates("/about", locale) };
};

export function AboutView({ locale }: Props) {
  const c = getContent(locale).about;
  return (
    <>
      <section data-theme="dark" className="min-h-[72svh] bg-charcoal pb-24 pt-[calc(var(--header-h)+3rem)] text-paper md:min-h-[82svh] md:pb-40 md:pt-[calc(var(--header-h)+6rem)]">
        <div className="wrap">
          <SectionLabel className="text-paper/60">{c.label}</SectionLabel>
          <ScrubWords as="h1" text={c.headline} className="display mt-6 !text-[clamp(2.6rem,8.2vw,9rem)]" />
        </div>
      </section>

      <section data-theme="light" className="bg-sand">
        <div data-scrub-clip className="relative aspect-[4/3] max-h-[90svh] w-full overflow-hidden md:aspect-[16/9]">
          <Asset id="A01" sizes="100vw" />
        </div>
      </section>

      <section data-theme="light" className="bg-sand py-20 md:py-32">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <p data-reveal className="subhead md:col-span-7">{c.lead}</p>
          <div className="space-y-5 md:col-span-4 md:col-start-9">
            {c.body.map((text) => (
              <p key={text} data-reveal className="text-charcoal/80">{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="dark" className="bg-charcoal py-20 text-paper md:py-32">
        <div className="wrap">
          <SectionLabel className="text-paper/60">{c.name.label}</SectionLabel>
          <h2 data-reveal className="headline mt-6 !text-[clamp(2.25rem,5.4vw,5.6rem)]">{c.name.headline}</h2>
          <ul className="mt-14 grid gap-x-6 md:grid-cols-5">
            {c.name.letters.map((l, i) => (
              <li key={`${l.word}-${i}`} data-reveal className="flex items-baseline gap-5 border-t border-paper/20 py-5 md:block md:py-6">
                <span aria-hidden className="block w-[1em] shrink-0 text-[clamp(3.25rem,7vw,7.5rem)] font-medium leading-none tracking-[-0.035em]">{l.word[0]}</span>
                <span className="md:mt-5 md:block">
                  <span className="subhead block">{l.word}</span>
                  {l.meaning ? <span className="mt-1 block text-paper/65">{l.meaning}</span> : null}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-5 md:grid-cols-12">
            {c.name.body.map((text) => (
              <p key={text} data-reveal className="text-paper/80 md:col-span-5">{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="light" className="bg-paper py-20 md:py-32">
        <div className="wrap">
          <SectionLabel>{c.how.label}</SectionLabel>
          <h2 data-reveal className="headline mt-6 max-w-[14em] !text-[clamp(2.25rem,5.4vw,5.6rem)]">{c.how.headline}</h2>
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {c.how.points.map((p, i) => (
              <li key={p.title} data-reveal className="border-t border-charcoal/25 pt-5">
                <span className="text-sm tabular-nums text-charcoal/55">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="subhead mt-4">{p.title}</h3>
                <p className="mt-3 max-w-[26em] text-charcoal/75">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-theme="dark" className="bg-deep py-20 text-paper md:py-32">
        <div className="wrap">
          <SectionLabel className="text-paper/70">{c.beliefs.label}</SectionLabel>
          <ul className="mt-10">
            {c.beliefs.items.map((b) => (
              <li key={b} data-reveal className="border-t border-paper/20 py-6 text-[clamp(1.75rem,4.4vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.035em] md:py-8">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuoteBand locale={locale} />
    </>
  );
}
