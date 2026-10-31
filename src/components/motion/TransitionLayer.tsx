"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollControl } from "@/lib/gsap";
import { Mark } from "@/components/brand/Logo";

/** A short charcoal wipe between pages. Intercepts internal links only; every link still works without JS. */
export function TransitionLayer() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      if (prefersReducedMotion()) return;

      e.preventDefault();
      if (covering.current) return;
      covering.current = true;
      scrollControl.stop();
      gsap.fromTo(
        curtain.current,
        { yPercent: 100, autoAlpha: 1 },
        {
          yPercent: 0,
          duration: 0.45,
          ease: "power3.inOut",
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  useEffect(() => {
    scrollControl.start();
    if (!location.hash) scrollControl.toTop();
    ScrollTrigger.refresh();
    if (!covering.current) return;
    covering.current = false;
    gsap.to(curtain.current, {
      yPercent: -100,
      duration: 0.55,
      delay: 0.06,
      ease: "power3.inOut",
      onComplete: () => void gsap.set(curtain.current, { autoAlpha: 0, yPercent: 100 }),
    });
  }, [pathname]);

  return (
    <div
      ref={curtain}
      aria-hidden
      style={{ visibility: "hidden" }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal text-paper"
    >
      <Mark className="w-12" />
    </div>
  );
}
