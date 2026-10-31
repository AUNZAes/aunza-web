"use client";

import dynamic from "next/dynamic";
import { Asset } from "@/components/ui/Asset";
import { ScrollStage } from "@/components/motion/ScrollStage";
import type { Content } from "@/content";

const GiftScene = dynamic(() => import("@/components/three/christmas/GiftScene"), { ssr: false });

export function GiftExperience({ copy: c }: { copy: Content["christmas"]["opening"] }) {
  return (
    <ScrollStage
      Scene={GiftScene}
      captions={c.captions}
      heightClass="h-[420vh] md:h-[540vh]"
      background="bg-[#d0a985]"
      stageClass="christmas-stage"
      label={c.label}
      fallback={
        <div className="wrap py-20 md:py-32">
          <p className="label">{c.label}</p>
          <div className="relative mt-8 aspect-[3/2] overflow-hidden">
            <Asset id="XC1" sizes="100vw" />
          </div>
          <ol className="mt-8 grid gap-6 md:grid-cols-5">
            {c.captions.map((s) => (
              <li key={s.title}>
                <p className="text-lg font-medium tracking-[-0.02em]">{s.title}</p>
                <p className="mt-1 text-charcoal/75">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      }
    />
  );
}
