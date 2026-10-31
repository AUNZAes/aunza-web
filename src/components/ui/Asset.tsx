"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { alts as esAlts } from "@/content/es/alts";
import { localeOf } from "@/i18n/config";
import manifest from "@/content/assets.generated.json";
import { ProductIcon, type IconName } from "./ProductIcon";

type Entry = {
  alt: string;
  ratio: number;
  tone: string;
  icon: string;
  final?: { src: string; width: number; height: number };
  temp?: string;
  fallback?: string;
};

export type AssetId = keyof typeof manifest;

const assets = manifest as Record<string, Entry>;

const TONES: Record<string, string> = {
  charcoal: "bg-charcoal text-paper",
  sand: "bg-sand text-charcoal",
  terracotta: "bg-terracotta text-charcoal",
  sage: "bg-sage text-charcoal",
  deep: "bg-deep text-paper",
  paper: "bg-[#efece4] text-charcoal",
};

type AssetProps = {
  id: AssetId;
  /** Responsive `sizes`, required for good image selection. */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Override the alt text; pass "" when the image is decorative in context. */
  alt?: string;
};

/**
 * Every image on the site goes through here. It fills its positioned parent and
 * resolves to, in order: the final image; an optional asset's fallback; a temporary
 * crop of the brand board; a neutral placeholder. Anything that isn't final carries
 * a visible flag naming the asset ID to replace.
 */
export function Asset({ id, sizes, className = "", priority, alt }: AssetProps) {
  const own = assets[id];
  const entry = !own.final && own.fallback ? assets[own.fallback] : own;
  const shownId = !own.final && own.fallback ? own.fallback : id;
  // Alt text describes what is actually shown, which may be the fallback, in the page's language.
  const spanish = localeOf(usePathname()) === "es";
  const label = alt ?? (spanish ? esAlts[shownId] : undefined) ?? entry.alt;

  if (entry.final) {
    return (
      <Image src={entry.final.src} alt={label} fill sizes={sizes} priority={priority} quality={92} className={`object-cover ${className}`} />
    );
  }

  if (entry.temp) {
    return (
      <>
        <Image src={entry.temp} alt={label} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
        <span className="asset-flag" aria-hidden>Temp · {id === shownId ? id : `${id}→${shownId}`}</span>
      </>
    );
  }

  return (
    <span role="img" aria-label={label} className={`absolute inset-0 flex items-center justify-center ${TONES[entry.tone] ?? TONES.sand} ${className}`}>
      <ProductIcon name={entry.icon as IconName} className="w-[min(26%,5rem)] opacity-60" />
      <span className="asset-flag">Placeholder · {id}</span>
    </span>
  );
}
