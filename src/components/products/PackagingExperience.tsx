"use client";

import dynamic from "next/dynamic";
import { Asset } from "@/components/ui/Asset";
import { ScrollStage } from "@/components/motion/ScrollStage";
import type { Content } from "@/content";

const PackagingScene = dynamic(() => import("@/components/three/PackagingScene"), { ssr: false });

export function PackagingExperience({ copy }: { copy: Content["experiences"]["packaging"] }) {
  return (
    <ScrollStage
      Scene={PackagingScene}
      captions={copy.captions}
      heightClass="h-[420vh] md:h-[560vh]"
      background="bg-sand"
      label={copy.label}
      fallback={
        <div className="wrap py-20">
          <p className="label">{copy.label}</p>
          <div className="relative mt-8 aspect-[3/2] overflow-hidden">
            <Asset id="PD1" sizes="100vw" />
          </div>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {copy.captions.map((s) => (
              <li key={s.title}>
                <p className="text-lg font-medium tracking-[-0.02em]">{s.title}</p>
                <p className="mt-1 text-charcoal/70">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      }
    />
  );
}
