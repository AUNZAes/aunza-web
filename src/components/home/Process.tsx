"use client";

import { useEffect, useRef, useState } from "react";
import { Asset, type AssetId } from "@/components/ui/Asset";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { ScrollTrigger, gsap } from "@/lib/gsap";
import type { Content } from "@/content";

/** Scroll-driven process: the stage list stays readable while its image and progress bar follow scroll. */
export function Process({ copy: c }: { copy: Content["home"]["process"] }) {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setActive(Math.min(c.stages.length - 1, Math.floor(self.progress * c.stages.length)));
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [c.stages.length]);

  return (
    <section ref={root} data-theme="light" className="bg-paper lg:h-[340vh]">
      {/* Desktop */}
      <div className="sticky top-0 hidden h-svh flex-col pb-10 pt-[calc(var(--header-h)+1rem)] lg:flex">
        <div className="wrap flex min-h-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between">
            <h2 className="headline !text-[clamp(2.4rem,4.6vw,5rem)]">{c.headline}</h2>
            <p className="label">{c.label}</p>
          </div>
          <div className="mt-8 grid min-h-0 flex-1 grid-cols-12 gap-6">
            <ol className="col-span-5 flex flex-col justify-center gap-[clamp(1rem,3vh,2rem)]">
              {c.stages.map((s, i) => (
                <li key={s.n} aria-current={active === i ? "step" : undefined} className={`transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-45"}`}>
                  <p className="text-[clamp(1.5rem,2.6vw,2.6rem)] font-medium leading-tight tracking-[-0.03em]">
                    <span className="mr-3 tabular-nums">{s.n}</span>— {s.title}
                  </p>
                  <p className="mt-1 max-w-[28em] text-charcoal/75">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="relative col-span-7 min-h-0 overflow-hidden">
              {c.stages.map((s, i) => (
                <div key={s.n} className={`absolute inset-0 transition-[clip-path] duration-[900ms] ease-[var(--ease-brand)] ${i <= active ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_0_0_0)]"}`} style={{ zIndex: i }}>
                  <Asset id={s.image as AssetId} sizes="58vw" />
                </div>
              ))}
            </div>
          </div>
          <span className="relative mt-6 block h-px w-full bg-charcoal/15">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-charcoal" />
          </span>
        </div>
      </div>

      {/* Mobile and tablet: a simple stacked sequence */}
      <div className="wrap py-24 lg:hidden">
        <SectionLabel>{c.label}</SectionLabel>
        <Lines lines={c.lines} className="headline mt-6" />
        <ol className="mt-12 space-y-14">
          {c.stages.map((s) => (
            <li key={s.n} data-reveal>
              <div className="relative aspect-[3/2] overflow-hidden">
                <Asset id={s.image as AssetId} sizes="100vw" />
              </div>
              <p className="mt-5 text-2xl font-medium tracking-[-0.03em]">
                <span className="tabular-nums">{s.n}</span> — {s.title}
              </p>
              <p className="mt-1 text-charcoal/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
