"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/**
 * Photographic studio built entirely from local light cards, so no HDR file is downloaded:
 * a large soft window from the upper left, a fill from the right and a soft overhead.
 */
export function Studio({ shadows = true, shadowOpacity = 0.42, shadowScale = 16 }: { shadows?: boolean; shadowOpacity?: number; shadowScale?: number }) {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#c8c6c2"]} />
        <Lightformer form="rect" intensity={3.2} position={[-6, 5, 4]} scale={[8, 10, 1]} rotation={[0, Math.PI / 3, 0]} color="#fff6ea" />
        <Lightformer form="rect" intensity={1} position={[7, 2, 3]} scale={[5, 9, 1]} rotation={[0, -Math.PI / 3, 0]} color="#fff" />
        <Lightformer form="rect" intensity={1.5} position={[0, 9, 0]} scale={[12, 12, 1]} rotation={[Math.PI / 2, 0, 0]} color="#fff" />
        <Lightformer form="rect" intensity={0.7} position={[0, 2, -8]} scale={[12, 6, 1]} rotation={[0, Math.PI, 0]} color="#ffe9d8" />
      </Environment>
      <directionalLight position={[-5, 7, 5]} intensity={0.9} color="#fff4e6" />
      {shadows ? (
        <ContactShadows position={[0, 0, 0]} scale={shadowScale} resolution={768} blur={2.6} far={4} opacity={shadowOpacity} color="#2b2118" />
      ) : null}
    </>
  );
}
