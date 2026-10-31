"use client";

import Link from "@/components/ui/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/Logo";
import { Arrow } from "@/components/ui/ProductIcon";
import { scrollControl } from "@/lib/gsap";
import { stripLocale } from "@/i18n/config";
import { LanguageSwitch } from "./LanguageSwitch";

type HeaderProps = {
  site: {
    nav: { href: string; label: string }[];
    quoteLabel: string;
    a11y: { skip: string; home: string; openMenu: string; closeMenu: string; mainNav: string; mobileNav: string; language: string };
  };
};

export function Header({ site }: HeaderProps) {
  const pathname = usePathname();
  const path = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The bar takes its colours from whichever section sits underneath it.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 36)
        .find((el) => el.closest("[data-theme]") && !el.closest("header"));
      setDark(under?.closest("[data-theme]")?.getAttribute("data-theme") === "dark");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    scrollControl.stop();
    document.documentElement.style.overflow = "hidden";
    const links = menuRef.current?.querySelectorAll<HTMLElement>("a");
    links?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && links?.length) {
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === toggleRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      scrollControl.start();
    };
  }, [open]);

  const light = dark || open;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-charcoal">
        {site.a11y.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${light ? "text-paper" : "text-charcoal"} ${
          scrolled && !open ? (light ? "bg-charcoal/40 backdrop-blur-xl" : "bg-paper/70 backdrop-blur-xl") : ""
        }`}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href="/" aria-label={site.a11y.home} className="block shrink-0">
            <Wordmark className="h-[1.05rem] w-auto" />
          </Link>

          <nav aria-label={site.a11y.mainNav} className="hidden items-center gap-5 xl:flex xl:gap-8">
            {site.nav.map((item) => {
              const current = path === item.href || path.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`whitespace-nowrap text-[0.8125rem] tracking-[0.01em] transition-opacity hover:opacity-100 ${current ? "opacity-100" : "opacity-85"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/quote"
              className={`btn hidden !min-h-[2.5rem] whitespace-nowrap !px-5 !py-2 !tracking-[0.18em] sm:inline-flex ${light ? "btn-line-light" : "btn-line-dark"}`}
            >
              {site.quoteLabel}
            </Link>
            <LanguageSwitch label={site.a11y.language} />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? site.a11y.closeMenu : site.a11y.openMenu}
              className="relative -mr-2 h-11 w-11 xl:hidden"
            >
              <span className={`absolute left-2.5 right-2.5 top-[1.15rem] h-px bg-current transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`absolute left-2.5 right-2.5 top-[1.5rem] h-px bg-current transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-charcoal px-[var(--gutter)] pb-8 pt-28 text-paper transition-[clip-path] duration-500 ease-[var(--ease-brand)] xl:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label={site.a11y.mobileNav} className="flex flex-1 flex-col gap-1">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="py-2 text-[2.5rem] font-medium leading-tight tracking-[-0.03em]">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/quote" className="btn btn-paper w-full">
          {site.quoteLabel} <Arrow />
        </Link>
      </div>
    </>
  );
}
