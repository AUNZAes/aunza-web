"use client";

import Link from "@/components/ui/LocaleLink";
import { useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, SectionLabel } from "@/components/ui/Text";
import type { Content } from "@/content";

/** Editorial product index: names on the left, one dedicated image on the right that follows hover and focus. */
export function Collections({ copy: c, products }: { copy: Content["home"]["collections"]; products: Pick<Content["products"][number], "slug" | "name" | "short" | "hero">[] }) {
  const [active, setActive] = useState(0);

  return (
    <section data-theme="light" id="collections" className="bg-sand py-24 md:py-36">
      <div className="wrap">
        <SectionLabel>{c.label}</SectionLabel>
        <Lines lines={c.lines} className="headline mt-6" />
        <p data-reveal className="lede mt-8">{c.text}</p>

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12">
          <ul className="lg:col-span-7">
            {products.map((p, i) => (
              <li key={p.slug} className="border-t border-charcoal/20 last:border-b">
                <Link
                  href={`/products/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group flex items-center gap-4 py-4 transition-opacity duration-300 md:py-5 lg:opacity-55 lg:hover:opacity-100 lg:focus-visible:opacity-100 ${active === i ? "lg:!opacity-100" : ""}`}
                >
                  <span className="relative aspect-square w-20 shrink-0 overflow-hidden lg:hidden [&_.asset-flag]:hidden">
                    <Asset id={p.hero} sizes="80px" alt="" className="!object-cover" />
                  </span>
                  <span className="hidden w-10 text-sm tabular-nums lg:block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.5rem] font-medium leading-tight tracking-[-0.03em] md:text-[clamp(1.75rem,3.1vw,3.25rem)]">{p.name}</span>
                    <span className="mt-1 block text-[0.875rem] leading-snug text-charcoal/70 lg:hidden">{p.short}</span>
                  </span>
                  <Arrow className="w-6 shrink-0 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:translate-x-1.5" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="sticky top-24 aspect-[4/5] overflow-hidden" aria-hidden>
              {products.map((p, i) => (
                <div
                  key={p.slug}
                  className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-brand)] ${active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                >
                  <Asset id={p.hero} sizes="42vw" alt="" />
                </div>
              ))}
              <p className="absolute right-4 top-4 z-10 max-w-[16rem] rounded-sm bg-paper/90 px-3 py-2 text-[0.8125rem] leading-snug text-charcoal">
                {products[active].short}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 md:mt-24 md:flex-row md:items-end md:justify-between">
          <p data-reveal className="subhead max-w-[20em]">{c.different}</p>
          <Link data-reveal href="/quote?category=custom-products" className="btn btn-ink w-full shrink-0 sm:w-auto">
            {c.cta} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
