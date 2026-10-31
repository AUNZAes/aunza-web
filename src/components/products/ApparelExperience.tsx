"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { WORDMARK_PATH, WORDMARK_STROKE, WORDMARK_VIEWBOX } from "@/lib/logo";
import type { Content } from "@/content";

const SWATCHES = [
  { fabric: "#efece4", ink: "#1f1f1f" },
  { fabric: "#ddd4c5", ink: "#1f1f1f" },
  { fabric: "#7f9d8e", ink: "#f8f7f3" },
  { fabric: "#d97862", ink: "#1f1f1f" },
  { fabric: "#2e4a6b", ink: "#f8f7f3" },
  { fabric: "#2a2a2a", ink: "#f8f7f3" },
];

const TEE =
  "M178 62 C190 92 222 110 260 110 C298 110 330 92 342 62 L392 82 C424 94 454 114 476 140 L510 182 C514 188 513 196 507 200 L444 246 C438 250 431 249 427 243 L396 204 L396 470 C396 482 388 488 378 488 L142 488 C132 488 124 482 124 470 L124 204 L93 243 C89 249 82 250 76 246 L13 200 C7 196 6 188 10 182 L44 140 C66 114 96 94 128 82 Z";

/** A garment that changes colour and takes on its print and embroidery as you scroll. Swatches also let visitors pick. */
export function ApparelExperience({ copy }: { copy: Omit<Content["experiences"]["apparel"], "garment"> & { garment: string } }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [swatch, setSwatch] = useState(0);
  const [step, setStep] = useState(0);
  const [animated, setAnimated] = useState(false);
  const picked = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStep(3);
      setSwatch(2);
      return;
    }
    setAnimated(true);
    const narrow = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              setStep(p < 0.2 ? 0 : p < 0.48 ? 1 : p < 0.72 ? 2 : 3);
              if (!picked.current) setSwatch(p < 0.2 ? 0 : p < 0.3 ? 1 : p < 0.38 ? 3 : 2);
            },
          },
        })
        .fromTo("[data-tee]", { scale: 0.92, rotate: -1.5 }, { scale: 1, rotate: 0, duration: 0.45, ease: "none" })
        .fromTo("[data-print]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.2, ease: "none" }, 0.48)
        .fromTo("[data-tee-wrap]", { scale: 1, yPercent: 0 }, { scale: narrow ? 1.6 : 2.15, yPercent: narrow ? 20 : 34, xPercent: narrow ? -14 : 12, duration: 0.2, ease: "power1.inOut" }, 0.74)
        .fromTo("[data-stitch]", { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none" }, 0.8)
        .to("[data-print]", { opacity: 0, duration: 0.04 }, 0.74);
    }, root);
    return () => ctx.revert();
  }, []);

  const s = SWATCHES[swatch];
  const logoW = 150;
  const k = logoW / WORDMARK_VIEWBOX.width;

  return (
    <section ref={root} data-theme="light" aria-label={copy.label} className="h-[420vh] bg-paper motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-20">
        <div className="wrap grid h-full items-center gap-6 pt-[var(--header-h)] md:grid-cols-12">
          <div className="relative z-10 order-2 pb-6 md:order-1 md:col-span-4 md:pb-0">
            <p className="label">{copy.label}</p>
            <div className="relative mt-3 h-[5.5rem] md:h-32" aria-live="polite">
              {copy.stages.map((st, i) => (
                <div key={st.title} className={`absolute inset-0 transition-[opacity,transform] duration-500 ${step === i ? "opacity-100" : "translate-y-3 opacity-0"}`} aria-hidden={step !== i}>
                  <p className="subhead">{st.title}</p>
                  <p className="mt-1 text-charcoal/70">{st.note}</p>
                </div>
              ))}
            </div>
            <div role="radiogroup" aria-label={copy.colourLabel} className="mt-2 flex gap-2">
              {SWATCHES.map((o, i) => (
                <button
                  key={o.fabric}
                  type="button"
                  role="radio"
                  aria-checked={swatch === i}
                  aria-label={copy.swatches[i]}
                  onClick={() => {
                    picked.current = true;
                    setSwatch(i);
                  }}
                  className={`h-9 w-9 rounded-full border transition-shadow ${swatch === i ? "shadow-[0_0_0_2px_#f8f7f3,0_0_0_3px_#1f1f1f]" : ""}`}
                  style={{ background: o.fabric, borderColor: "rgb(31 31 31 / 0.2)" }}
                />
              ))}
            </div>
          </div>

          <div ref={stage} className="relative order-1 flex min-h-0 items-center justify-center md:order-2 md:col-span-8 md:h-full">
            <div data-tee-wrap className="w-full max-w-[min(100%,calc(100svh-14rem))] md:max-w-[min(90%,calc(100svh-8rem))]">
              <svg data-tee viewBox="0 0 520 520" className="h-auto w-full overflow-visible" role="img" aria-label={copy.garment.replace("{colour}", copy.swatches[swatch])}>
                <defs>
                  <filter id="fabric" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
                    <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" />
                    <feComposite in2="SourceAlpha" operator="in" />
                    <feBlend in2="SourceGraphic" mode="multiply" />
                  </filter>
                  <linearGradient id="fold1" x1="0" x2="1">
                    <stop offset="0" stopColor="#000" stopOpacity="0.2" />
                    <stop offset="0.22" stopColor="#000" stopOpacity="0" />
                    <stop offset="0.78" stopColor="#000" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.24" />
                  </linearGradient>
                  <linearGradient id="fold2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0.6" stopColor="#000" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.16" />
                  </linearGradient>
                  <filter id="soft"><feGaussianBlur stdDeviation="7" /></filter>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
                  <clipPath id="teeClip"><path d={TEE} /></clipPath>
                </defs>

                <path d={TEE} transform="translate(0 14)" fill="#2b2118" opacity="0.2" filter="url(#softShadow)" />
                <path d={TEE} fill={s.fabric} filter="url(#fabric)" className="transition-[fill] duration-700" />
                <g clipPath="url(#teeClip)">
                  <rect x="0" y="0" width="520" height="520" fill="url(#fold1)" />
                  <rect x="0" y="0" width="520" height="520" fill="url(#fold2)" />
                  {/* Soft cloth folds */}
                  <g filter="url(#soft)" fill="none" strokeLinecap="round">
                    <path d="M150 210 C180 300 170 390 150 480" stroke="#000" strokeOpacity="0.1" strokeWidth="16" />
                    <path d="M372 220 C340 300 356 400 372 480" stroke="#000" strokeOpacity="0.09" strokeWidth="16" />
                    <path d="M214 330 C240 390 240 440 226 490" stroke="#fff" strokeOpacity="0.09" strokeWidth="16" />
                    <path d="M128 92 C126 130 124 170 122 208" stroke="#000" strokeOpacity="0.14" strokeWidth="10" />
                    <path d="M392 92 C394 130 396 170 398 208" stroke="#000" strokeOpacity="0.14" strokeWidth="10" />
                  </g>
                  {/* Sleeve seams */}
                  <path d="M124 204 L128 82 M396 204 L392 82" stroke="#000" strokeOpacity="0.2" strokeWidth="1" fill="none" />
                  <path d="M124 468 H396" stroke="#000" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 2" />
                </g>
                {/* Collar */}
                <path d="M178 62 C190 92 222 110 260 110 C298 110 330 92 342 62 L356 68 C342 106 304 126 260 126 C216 126 178 106 164 68 Z" fill="#000" fillOpacity="0.12" />
                <path d="M178 62 C196 76 224 84 260 84 C296 84 324 76 342 62 C330 92 298 110 260 110 C222 110 190 92 178 62 Z" fill="#000" fillOpacity="0.28" />
                <rect x="247" y="76" width="26" height="14" rx="1" fill="#f8f7f3" opacity="0.9" />

                {/* Screen print: the wordmark large across the chest */}
                <g data-print style={{ clipPath: animated ? undefined : "none", opacity: step >= 2 && !animated ? 0 : undefined }}>
                  <g transform={`translate(${260 - 95} 200) scale(${190 / WORDMARK_VIEWBOX.width})`}>
                    <path d={WORDMARK_PATH} fill={s.ink} stroke={s.ink} strokeWidth={WORDMARK_STROKE} strokeLinejoin="round" className="transition-[fill,stroke] duration-700" />
                  </g>
                  <circle cx="218" cy="290" r="24" fill="#d97862" />
                  <path d="M250 268 C276 262 306 276 300 302 C296 322 262 322 250 306 C242 294 238 272 250 268Z" fill={s.fabric === "#7f9d8e" ? "#ede7de" : "#7f9d8e"} />
                </g>

                {/* Embroidery: same mark, stitched, on the wearer's left chest */}
                <g data-stitch opacity={animated ? 0 : 1} transform={`translate(${312 - logoW / 4} 170) scale(${k / 2})`}>
                  <path d={WORDMARK_PATH} fill={s.ink} />
                  <path d={WORDMARK_PATH} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="10" strokeDasharray="7 6" />
                  <path d={WORDMARK_PATH} fill="none" stroke={s.ink} strokeWidth="6" strokeDasharray="7 6" strokeDashoffset="7" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
