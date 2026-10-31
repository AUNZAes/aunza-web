import Link from "@/components/ui/LocaleLink";
import type { CSSProperties } from "react";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, ScrubWords, SectionLabel } from "@/components/ui/Text";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";

export function Hero({ locale }: { locale: Locale }) {
  const h = getContent(locale).home.hero;
  return (
    // The photograph fills the screen and the headline sits on it, in its calm left half. It is kept
    // at full height and anchored right, so products are never cropped: on wider screens the section's
    // gradient, sampled from the photo's left edge, continues the backdrop; on narrower ones only the
    // empty left side runs off screen.
    <section
      data-theme="light"
      style={
        {
          "--hero-size": h.size,
          background: "linear-gradient(to bottom, #a8937b, #b49f88 50%, #c2ab92)",
        } as CSSProperties
      }
      className="relative flex min-h-svh flex-col overflow-hidden pt-[var(--header-h)]"
    >
      <div className="wrap relative z-10 order-1 pt-4 lg:pt-[clamp(0.5rem,2svh,1.5rem)]">
        <Lines as="h1" lines={h.lines} className="display lg:!text-[length:var(--hero-size)]" />
      </div>

      <div className="relative order-2 mt-2 h-[min(52svh,105vw)] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto lg:[mask-image:none]">
        <div className="absolute inset-y-0 right-0 aspect-[3/2] [mask-image:linear-gradient(to_right,transparent,black_10%)]">
          <Asset id="H01" priority sizes="(min-width: 1024px) 100vw, 170vw" />
        </div>
      </div>

      <div className="wrap relative z-10 order-3 mt-2 pb-10 lg:mt-auto lg:pb-10">
        <div data-load="rise" style={{ "--d": 5 } as CSSProperties} className="max-w-[21rem] lg:max-w-[15rem] xl:max-w-[21rem]">
          <p className="text-[1.0625rem] leading-snug tracking-[-0.01em]">{h.text}</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <Link href="/products" className="btn btn-ink w-full sm:w-auto">
              {h.primary} <Arrow />
            </Link>
            <Link href="/quote" className="btn btn-line-dark w-full sm:w-auto">
              {h.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrandIntro({ locale }: { locale: Locale }) {
  const c = getContent(locale).home.intro;
  return (
    <section data-theme="dark" className="bg-charcoal py-24 text-paper md:py-40">
      <div className="wrap grid items-end gap-14 md:grid-cols-12">
        <div className="md:col-span-8">
          <ScrubWords text={c.headline} className="display !text-[clamp(3rem,9.6vw,10.5rem)]" />
        </div>
        <div className="md:col-span-4">
          <div data-reveal="mask" className="relative aspect-[2/3] overflow-hidden">
            <div className="absolute inset-0">
              <Asset id="H02" sizes="(min-width: 768px) 32vw, 100vw" />
            </div>
          </div>
          <p data-reveal className="lede mt-8 text-paper/80">{c.text}</p>
        </div>
      </div>
    </section>
  );
}

// Layout of the market grid: each row reads differently so the eye keeps moving.
const MARKET_LAYOUT = [
  { col: "md:col-span-7", ratio: "aspect-[3/2]" },
  { col: "md:col-span-5", ratio: "aspect-[3/2] md:aspect-[5/4]" },
  { col: "md:col-span-4", ratio: "aspect-[3/2] md:aspect-[4/5]" },
  { col: "md:col-span-4", ratio: "aspect-[3/2] md:aspect-[4/5]" },
  { col: "md:col-span-4", ratio: "aspect-[3/2] md:aspect-[4/5]" },
  { col: "md:col-span-5", ratio: "aspect-[3/2] md:aspect-[5/4]" },
  { col: "md:col-span-7", ratio: "aspect-[3/2]" },
  { col: "md:col-span-12", ratio: "aspect-[3/2] md:aspect-[21/8]" },
];

export function Markets({ locale }: { locale: Locale }) {
  const { home, markets } = getContent(locale);
  const c = home.markets;
  return (
    <section data-theme="light" id="markets" className="bg-paper py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel className="md:col-span-12">{c.label}</SectionLabel>
          <Lines lines={c.lines} className="headline md:col-span-8" />
          <p data-reveal className="lede self-end md:col-span-4">{c.text}</p>
        </div>

        <ul className="mt-16 grid gap-x-6 gap-y-14 md:mt-24 md:grid-cols-12 md:gap-y-20">
          {markets.map((m, i) => (
            <li key={m.slug} className={MARKET_LAYOUT[i].col}>
              <Link href={`/markets/${m.slug}`} className="group block" data-reveal>
                <div className={`card-media relative overflow-hidden ${MARKET_LAYOUT[i].ratio}`}>
                  <Asset id={m.hero} sizes="(min-width: 768px) 60vw, 100vw" alt="" />
                </div>
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-xl font-medium tracking-[-0.02em] md:text-[1.625rem]">
                    <span className="mr-3 text-sm font-normal text-charcoal/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {m.name}
                  </h3>
                </div>
                <p className="mt-2 max-w-[34em] text-[0.9375rem] text-charcoal/75">{m.who}</p>
                <p className="mt-2 max-w-[34em] text-[0.875rem] text-charcoal/55">
                  {m.products.slice(0, 3).map((p) => p.name).join(" · ")}
                </p>
                <span className="label mt-4 inline-flex items-center gap-3">
                  {c.discover} <Arrow className="w-5 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:translate-x-1.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CustomProjects({ locale }: { locale: Locale }) {
  const c = getContent(locale).home.custom;
  return (
    <section data-theme="dark" className="overflow-hidden bg-charcoal py-24 text-paper md:py-40">
      <div className="wrap">
        <SectionLabel className="text-paper/60">{c.label}</SectionLabel>
        <Lines lines={c.lines} className="headline mt-6" />

        <div className="mt-16 grid grid-cols-12 gap-4 md:mt-24 md:gap-6">
          <div data-parallax="0.04" className="col-span-7 md:col-span-4 md:mt-28">
            <div data-reveal="mask" className="relative aspect-[2/3] overflow-hidden">
              <div className="absolute inset-0"><Asset id="C01" sizes="(min-width: 768px) 33vw, 58vw" /></div>
            </div>
          </div>
          <div data-parallax="0.1" className="col-span-5 mt-20 md:col-span-3 md:mt-0">
            <div data-reveal="mask" style={{ "--d": 2 } as CSSProperties} className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0"><Asset id="C03" sizes="(min-width: 768px) 25vw, 42vw" /></div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:mt-52">
            <div data-reveal="mask" style={{ "--d": 3 } as CSSProperties} className="relative aspect-[3/2] overflow-hidden">
              <div className="absolute inset-0"><Asset id="C02" sizes="(min-width: 768px) 42vw, 100vw" /></div>
            </div>
            <p data-reveal className="lede mt-8 text-paper/80">{c.text}</p>
            <Link data-reveal href="/custom-projects" className="btn btn-paper mt-8 w-full sm:w-auto">
              {c.cta} <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyAunza({ locale }: { locale: Locale }) {
  const c = getContent(locale).home.why;
  return (
    <section data-theme="dark" className="bg-deep py-24 text-paper md:py-40">
      <div className="wrap">
        <SectionLabel className="text-paper/70">{c.label}</SectionLabel>
        <Lines lines={c.lines} className="headline mt-6" />
        <ul className="mt-16 md:mt-28">
          {c.principles.map((p, i) => (
            <li key={p.title} data-reveal className="grid gap-3 border-t border-paper/20 py-8 md:grid-cols-12 md:items-baseline md:py-12">
              <span className="text-sm tabular-nums text-paper/60 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="subhead md:col-span-7">{p.title}</h3>
              <p className="text-paper/75 md:col-span-4">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FinalCta({ locale }: { locale: Locale }) {
  const c = getContent(locale).home.final;
  return (
    <section data-theme="dark" className="relative isolate overflow-hidden bg-[#ac4d2c] py-28 text-paper md:min-h-[66.6vw] md:pb-20 md:pt-32">
      {/* Full bleed: the photograph's own ground is the section's colour. Headline size and height keep the type clear of the box's logo. */}
      <div className="absolute inset-0 -z-10">
        <Asset id="H03" sizes="100vw" alt="" className="object-[85%_0%]" />
      </div>
      <div className="wrap">
        <Lines lines={c.lines} className="display !text-[clamp(2.9rem,8.2vw,9.5rem)]" />
        <p data-reveal className="lede mt-10 max-w-[24em]">{c.text}</p>
        <Link data-reveal href="/quote" className="btn btn-paper mt-10 w-full sm:w-auto">
          {c.cta} <Arrow />
        </Link>
      </div>
    </section>
  );
}
