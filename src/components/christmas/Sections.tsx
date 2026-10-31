import Link from "@/components/ui/LocaleLink";
import type { CSSProperties } from "react";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { getContent } from "@/content";
import type { ChristmasChapter } from "@/content/en/christmas";
import type { Locale } from "@/i18n/config";

function ChapterTitle({ letter, name, headline, text, light }: { letter: string; name: string; headline: string; text: string; light?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <SectionLabel className={`md:col-span-12 ${light ? "text-paper/70" : ""}`}>
        {letter} — {name}
      </SectionLabel>
      <h2 data-reveal className="headline md:col-span-8 !text-[clamp(2.4rem,6vw,6.5rem)]">{headline}</h2>
      <p data-reveal className={`lede self-end md:col-span-4 ${light ? "text-paper/80" : ""}`}>{text}</p>
    </div>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item} data-reveal className="border-t border-charcoal/20 py-3 text-[clamp(1.0625rem,1.5vw,1.375rem)] tracking-[-0.015em] last:border-b">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ChristmasHero({ locale }: { locale: Locale }) {
  const h = getContent(locale).christmas.hero;
  return (
    // Same construction as the home hero: the photograph keeps its full height, anchored right, so
    // products are never cropped, and the section's gradient continues the backdrop to the left.
    <section
      data-theme="light"
      style={
        {
          "--hero-size": "min(7vw, 12.6svh)",
          background: "linear-gradient(to bottom, #c8a380, #d0a985 50%, #c9a786)",
        } as CSSProperties
      }
      className="relative flex min-h-svh flex-col overflow-hidden pt-[var(--header-h)]"
    >
      <div className="wrap relative z-10 order-1 pt-4 lg:pt-[clamp(0.5rem,2svh,1.5rem)]">
        <p className="label mb-3 lg:mb-4">{h.label}</p>
        <Lines as="h1" lines={h.lines} className="display !text-[clamp(3.2rem,14.5vw,5rem)] lg:!text-[length:var(--hero-size)]" />
      </div>

      <div className="relative order-2 mt-2 h-[min(46svh,100vw)] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto lg:[mask-image:none]">
        <div className="absolute inset-y-0 right-0 aspect-[3/2] [mask-image:linear-gradient(to_right,transparent,black_10%)]">
          <Asset id="XH1" priority sizes="(min-width: 1024px) 100vw, 160vw" />
        </div>
      </div>

      <div className="wrap relative z-10 order-3 mt-2 pb-10 lg:mt-auto lg:pb-10">
        <div data-load="rise" style={{ "--d": 5 } as CSSProperties} className="max-w-[23rem] lg:max-w-[17rem] xl:max-w-[23rem]">
          <p className="text-[1.0625rem] leading-snug tracking-[-0.01em]">{h.text}</p>
          <Link href={h.cta.href} className="btn btn-ink mt-6 w-full sm:w-auto">
            {h.cta.label} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ChristmasChapterSection({ chapter, tone }: { chapter: ChristmasChapter; tone: "sand" | "paper" }) {
  return (
    <section id={chapter.id} data-theme="light" className={`py-20 md:py-32 ${tone === "sand" ? "bg-sand" : "bg-paper"}`}>
      <div className="wrap">
        <ChapterTitle letter={chapter.letter} name={chapter.name} headline={chapter.headline} text={chapter.text} />
      </div>
      <div data-scrub-clip className="relative mt-12 aspect-[4/3] max-h-[92svh] w-full overflow-hidden md:mt-20 md:aspect-[3/2]">
        <Asset id={chapter.main} sizes="100vw" />
      </div>
      <div className="wrap mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-6">
        <div data-reveal="mask" className="relative aspect-[4/5] overflow-hidden md:col-span-4">
          <div className="absolute inset-0"><Asset id={chapter.details[0]} sizes="(min-width: 768px) 33vw, 100vw" /></div>
        </div>
        <div data-reveal="mask" style={{ "--d": 2 } as CSSProperties} className="relative aspect-square overflow-hidden md:col-span-4 md:mt-24">
          <div className="absolute inset-0"><Asset id={chapter.details[1]} sizes="(min-width: 768px) 33vw, 100vw" /></div>
        </div>
        <div className="flex flex-col justify-end gap-8 md:col-span-4">
          <ItemList items={chapter.items} />
          {chapter.cta ? (
            <Link data-reveal href={chapter.cta.href} className="btn btn-ink w-full self-start sm:w-auto">
              {chapter.cta.label} <Arrow />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ChristmasPeople({ locale }: { locale: Locale }) {
  const p = getContent(locale).christmas.people;
  return (
    <section id={p.id} data-theme="dark" className="overflow-hidden bg-deep py-20 text-paper md:py-32">
      <div className="wrap">
        <ChapterTitle letter={p.letter} name={p.name} headline={p.headline} text={p.text} light />
        {/* 2.5D: real photographs on layers that drift at different speeds. */}
        <div className="mt-14 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
          <figure className="md:col-span-7">
            <div data-parallax="0.04" data-reveal="mask" className="relative aspect-[3/2] overflow-hidden">
              <div className="absolute inset-0"><Asset id={p.team.image} sizes="(min-width: 768px) 58vw, 100vw" /></div>
            </div>
            <figcaption data-reveal className="mt-5">
              <h3 className="subhead">{p.team.title}</h3>
              <p className="mt-2 max-w-[30em] text-paper/75">{p.team.text}</p>
            </figcaption>
          </figure>
          <figure className="md:col-span-4 md:col-start-9 md:mt-40">
            <div data-parallax="0.1" data-reveal="mask" className="relative aspect-[2/3] overflow-hidden">
              <div className="absolute inset-0"><Asset id={p.clients.image} sizes="(min-width: 768px) 33vw, 100vw" /></div>
            </div>
            <figcaption data-reveal className="mt-5">
              <h3 className="subhead">{p.clients.title}</h3>
              <p className="mt-2 max-w-[30em] text-paper/75">{p.clients.text}</p>
            </figcaption>
          </figure>
        </div>
        <Link data-reveal href={p.cta.href} className="btn btn-paper mt-14 w-full sm:w-auto">
          {p.cta.label} <Arrow />
        </Link>
      </div>
    </section>
  );
}

export function ChristmasCustom({ locale }: { locale: Locale }) {
  const j = getContent(locale).christmas.custom;
  return (
    <section id={j.id} data-theme="light" className="bg-sand py-20 md:py-32">
      <div className="wrap">
        <ChapterTitle letter={j.letter} name={j.name} headline={j.headline} text={j.text} />
      </div>
      <div data-scrub-clip className="relative mt-12 aspect-[4/3] max-h-[92svh] w-full overflow-hidden md:mt-20 md:aspect-[3/2]">
        <Asset id={j.main} sizes="100vw" />
      </div>
      <div className="wrap mt-12 grid items-end gap-10 md:mt-20 md:grid-cols-12 md:gap-6">
        <div data-reveal="mask" className="relative aspect-[2/3] overflow-hidden md:col-span-5">
          <div className="absolute inset-0"><Asset id={j.detail} sizes="(min-width: 768px) 42vw, 100vw" /></div>
        </div>
        <div className="flex flex-col gap-8 md:col-span-6 md:col-start-7">
          <ItemList items={j.items} />
          <Link data-reveal href={j.cta.href} className="btn btn-ink w-full self-start sm:w-auto">
            {j.cta.label} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ChristmasFinal({ locale }: { locale: Locale }) {
  const f = getContent(locale).christmas.final;
  return (
    <section
      data-theme="light"
      style={{ background: "linear-gradient(to bottom, #c89d79, #d7ad88 50%, #e5ba94)" }}
      className="relative isolate flex min-h-svh flex-col overflow-hidden pt-[calc(var(--header-h)+1rem)]"
    >
      <div className="absolute inset-y-0 right-0 -z-10 hidden aspect-[3/2] [mask-image:linear-gradient(to_right,transparent,black_10%)] md:block">
        <Asset id="XF1" sizes="100vw" alt="" />
      </div>
      <div className="wrap">
        <Lines lines={f.lines} className="display !text-[clamp(3rem,8.4vw,9rem)]" />
        <p data-reveal className="lede mt-8 max-w-[24em]">{f.text}</p>
        <Link data-reveal href={f.cta.href} className="btn btn-ink mt-8 w-full sm:w-auto">
          {f.cta.label} <Arrow />
        </Link>
      </div>
      <div className="relative mt-8 aspect-[3/2] w-full md:hidden">
        <Asset id="XF1" sizes="100vw" alt="" className="object-[80%_100%]" />
      </div>
    </section>
  );
}
