"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isDesktopPointer = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

/** Shared with the transition layer and mobile menu so they can pause and reset smooth scrolling. */
export const scrollControl: {
  stop: () => void;
  start: () => void;
  toTop: () => void;
} = {
  stop: () => {},
  start: () => {},
  toTop: () => window.scrollTo(0, 0),
};
