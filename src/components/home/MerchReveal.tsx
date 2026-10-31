"use client";

import { useEffect, useRef } from "react";
import { Asset, type AssetId } from "@/components/ui/Asset";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Content } from "@/content";

// Each product's place in the 12×2 desktop stage, stepped so the composition builds up unevenly.
const PLACEMENT = [
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
];

/** The collection assembles itself one product at a time as you scroll. */
export function MerchReveal({ copy: c }: { copy: Content["home"]["collections"] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-merch]", root.current);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      items.forEach((el, i) => {
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", duration: 1 }, i * 0.85);
        tl.fromTo(el.querySelector("[data-merch-img]"), { scale: 1.2 }, { scale: 1, ease: "power2.out", duration: 1.2 }, i * 0.85);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" className="bg-charcoal text-paper lg:h-[320vh] motion-reduce:lg:h-auto" aria-label={c.merchLabel}>
      <div className="wrap flex flex-col py-20 lg:sticky lg:top-0 lg:h-svh lg:py-0 lg:pb-8 lg:pt-[calc(var(--header-h)+0.5rem)]">
        <div className="flex flex-col gap-3 pb-8 lg:flex-row lg:items-baseline lg:justify-between lg:pb-6">
          <h2 className="subhead">{c.merchHeadline}</h2>
          <p className="label text-paper/60">{c.merchLabel}</p>
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-3 lg:min-h-0 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
          {c.merch.map((m, i) => (
            <li key={m.id} data-merch className={`relative aspect-[4/5] overflow-hidden lg:aspect-auto ${PLACEMENT[i]}`}>
              <div data-merch-img className="absolute inset-0">
                <Asset id={m.id as AssetId} sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
              <span className="label absolute right-3 top-3 z-10 rounded-full bg-charcoal/60 px-3 py-1 !tracking-[0.18em] text-paper backdrop-blur-sm">{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
