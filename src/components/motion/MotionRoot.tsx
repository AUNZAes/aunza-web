"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, isDesktopPointer, prefersReducedMotion, scrollControl } from "@/lib/gsap";

/**
 * Site-wide motion, so that pages can stay server components and simply opt in:
 *   data-reveal="" | "mask" | "lines"   entrance when scrolled into view (CSS driven)
 *   data-parallax="0.12"                 scrubbed vertical drift, desktop only
 *   data-scrub-words                     words brighten as the block scrolls through
 *   data-scrub-clip                      image opens from an inset as it scrolls in
 */
export function MotionRoot() {
  const pathname = usePathname();

  // Smooth scrolling for wheel users only; touch and reduced motion keep native scrolling.
  useEffect(() => {
    if (prefersReducedMotion() || !isDesktopPointer()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    scrollControl.stop = () => lenis.stop();
    scrollControl.start = () => lenis.start();
    scrollControl.toTop = () => lenis.scrollTo(0, { immediate: true, force: true });
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scrollControl.stop = () => {};
      scrollControl.start = () => {};
      scrollControl.toTop = () => window.scrollTo(0, 0);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            observer.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) return;

      document.querySelectorAll<HTMLElement>("[data-scrub-words]").forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll(".w"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: block, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
          },
        );
      });

      document.querySelectorAll<HTMLElement>("[data-scrub-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 16% 14% 16%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 25%", scrub: 0.6 },
          },
        );
      });

      if (isDesktopPointer()) {
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || "0.1");
          gsap.fromTo(
            el,
            { yPercent: amount * 100 },
            {
              yPercent: -amount * 100,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      observer.disconnect();
      ctx.revert();
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return null;
}
