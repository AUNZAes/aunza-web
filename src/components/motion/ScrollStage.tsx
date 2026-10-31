"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/gsap";
import { hasWebGL, type SceneState } from "@/components/three/scene-utils";

export type Caption = { at: number; until: number; title: string; note?: string };

type ScrollStageProps = {
  Scene: ComponentType<{ state: SceneState; simple: boolean }>;
  captions: Caption[];
  /** Scroll length: tall screens get less, because touch scrolling covers more. */
  heightClass: string;
  background: string;
  /** Extra classes for the pinned screen, for backgrounds that shouldn't stretch with the scroll length. */
  stageClass?: string;
  label: string;
  /** Text shown once when the section begins. */
  intro?: ReactNode;
  /** Text shown at the end of the sequence. */
  outro?: ReactNode;
  outroAt?: number;
  /** Shown when WebGL is unavailable or reduced motion is on. */
  fallback: ReactNode;
};

const fade = (p: number, a: number, b: number) => {
  const inn = gsap.utils.clamp(0, 1, (p - a) / 0.025);
  const out = gsap.utils.clamp(0, 1, (b - p) / 0.025);
  return Math.min(inn, out);
};

/**
 * Scroll-scrubbed WebGL storytelling. Uses CSS `position: sticky` instead of a JS pin so that
 * scrolling is never blocked and mobile address-bar changes can't make it jump. The WebGL
 * bundle loads only when the section is close, nothing renders while it is off screen, and the
 * WebGL context is released once it is far away, so pages can hold several scenes.
 */
export function ScrollStage({ Scene, captions, heightClass, background, stageClass = "", label, intro, outro, outroAt = 0.88, fallback }: ScrollStageProps) {
  const root = useRef<HTMLElement>(null);
  const state = useRef<SceneState>({ p: 0, px: 0, py: 0 });
  const captionEls = useRef<(HTMLDivElement | null)[]>([]);
  const introEl = useRef<HTMLDivElement>(null);
  const outroEl = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"pending" | "scene" | "fallback">("pending");
  const [near, setNear] = useState(false);
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    setMode(prefersReducedMotion() || !hasWebGL() ? "fallback" : "scene");
    setSimple(window.matchMedia("(max-width: 767px), (pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (mode !== "scene" || !root.current) return;
    // Never builds before the first scroll: a scene right below the hero would otherwise block the page as it loads.
    let scrolled = window.scrollY > 0;
    let inRange = false;
    const build = () => {
      if (scrolled && inRange) setNear(true);
    };
    const onFirstScroll = () => {
      scrolled = true;
      build();
    };
    window.addEventListener("scroll", onFirstScroll, { once: true, passive: true });
    const load = new IntersectionObserver(
      ([e]) => {
        inRange = e.isIntersecting;
        build();
      },
      { rootMargin: "50% 0px" },
    );
    // Released further out than it loads, so scrolling around the boundary doesn't keep rebuilding the scene.
    const release = new IntersectionObserver(([e]) => !e.isIntersecting && setNear(false), { rootMargin: "150% 0px" });
    load.observe(root.current);
    release.observe(root.current);
    return () => {
      window.removeEventListener("scroll", onFirstScroll);
      load.disconnect();
      release.disconnect();
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "scene") return;
    const s = state.current;

    const paint = () => {
      const p = s.p;
      captions.forEach((c, i) => {
        const el = captionEls.current[i];
        if (!el) return;
        const o = fade(p, c.at, c.until);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 14}px, 0)`;
        el.style.visibility = o > 0 ? "visible" : "hidden";
      });
      if (introEl.current) {
        const o = 1 - gsap.utils.clamp(0, 1, p / 0.04);
        introEl.current.style.opacity = String(o);
        introEl.current.style.visibility = o > 0 ? "visible" : "hidden";
      }
      if (outroEl.current) {
        const o = gsap.utils.clamp(0, 1, (p - outroAt) / 0.05);
        outroEl.current.style.opacity = String(o);
        outroEl.current.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
        outroEl.current.style.visibility = o > 0 ? "visible" : "hidden";
      }
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
    };

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.to(s, {
          p: self.progress,
          duration: 0.45,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => {
            paint();
            s.invalidate?.();
          },
        });
      },
    });

    const onPointer = (e: PointerEvent) => {
      if (!st.isActive || e.pointerType !== "mouse") return;
      gsap.to(s, {
        px: (e.clientX / innerWidth - 0.5) * 2,
        py: (e.clientY / innerHeight - 0.5) * 2,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => s.invalidate?.(),
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    s.p = st.progress;
    paint();
    s.invalidate?.();
    return () => {
      st.kill();
      gsap.killTweensOf(s);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [mode, captions, outroAt]);

  if (mode === "fallback") {
    return (
      <section ref={root} data-theme="light" className={background} aria-label={label}>
        {fallback}
      </section>
    );
  }

  return (
    <section ref={root} data-theme="light" className={`${heightClass} ${background}`} aria-label={label}>
      <div className={`sticky top-0 h-svh overflow-hidden ${stageClass}`}>
        {near ? <Scene state={state.current} simple={simple} /> : null}

        {intro ? (
          <div ref={introEl} className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-[calc(var(--header-h)+1rem)]">
            {intro}
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="wrap relative h-40 md:h-48">
            {captions.map((c, i) => (
              <div
                key={c.title}
                ref={(el) => {
                  captionEls.current[i] = el;
                }}
                style={{ opacity: 0, visibility: "hidden" }}
                className="absolute bottom-8 left-[var(--gutter)] right-[var(--gutter)] md:bottom-12 md:max-w-[34rem] md:right-auto"
              >
                <p className="subhead">{c.title}</p>
                {c.note ? <p className="mt-1 text-charcoal/70">{c.note}</p> : null}
              </div>
            ))}
          </div>
        </div>

        {outro ? (
          <div ref={outroEl} style={{ opacity: 0, visibility: "hidden" }} className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-[calc(var(--header-h)+0.5rem)]">
            {outro}
          </div>
        ) : null}

        <span className="absolute bottom-10 right-[var(--gutter)] z-10 hidden h-28 w-px bg-charcoal/15 md:block" aria-hidden>
          <span ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-charcoal" />
        </span>

        {/* The same story for screen readers, which can't see the canvas. */}
        <div className="sr-only">
          <p>{captions.map((c) => `${c.title} ${c.note ?? ""}`).join(" ")}</p>
        </div>
      </div>
    </section>
  );
}
