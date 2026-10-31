"use client";

import dynamic from "next/dynamic";
import { Asset } from "@/components/ui/Asset";
import { ScrollStage } from "@/components/motion/ScrollStage";
import type { Content } from "@/content";

const CupScene = dynamic(() => import("@/components/three/CupScene"), { ssr: false });

export function CupExperience({ copy: c }: { copy: Content["home"]["transformation"] }) {
  return (
    <ScrollStage
      Scene={CupScene}
      captions={c.stages}
      heightClass="h-[560vh] md:h-[720vh]"
      background="bg-paper"
      label={c.label}
      outroAt={0.89}
      intro={
        <div className="wrap">
          <p className="label">{c.label}</p>
          <h2 className="headline mt-4 max-w-[9em] !text-[clamp(2rem,4.8vw,5.4rem)]">{c.headline}</h2>
          <p className="lede mt-4 max-w-[19em]">{c.text}</p>
        </div>
      }
      outro={
        <div className="wrap text-center">
          <p className="headline !text-[clamp(2rem,5.6vw,6rem)]">
            {c.closing[0]}
            <br />
            {c.closing[1]}
          </p>
        </div>
      }
      fallback={
        <div className="wrap py-24 md:py-36">
          <p className="label">{c.label}</p>
          <h2 className="headline mt-4">{c.headline}</h2>
          <p className="lede mt-6">{c.text}</p>
          <div className="relative mt-12 aspect-[3/2] overflow-hidden">
            <Asset id="M01" sizes="100vw" />
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-5">
            {c.stages.map((s) => (
              <li key={s.title}>
                <p className="text-lg font-medium tracking-[-0.02em]">{s.title}</p>
                <p className="mt-1 text-charcoal/70">{s.note}</p>
              </li>
            ))}
          </ol>
          <p className="subhead mt-12">{c.closing.join(" ")}</p>
        </div>
      }
    />
  );
}
