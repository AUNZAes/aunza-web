"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SceneBridge } from "./SceneBridge";
import { Studio } from "./Studio";
import { BRAND, panelTexture, wordmarkDecal } from "./textures";
import { keyframes, ramp, type SceneState } from "./scene-utils";

const W = 2.2;
const D = 1.65;
const H = 1.05;
const T = 0.022;

type PanelProps = { w: number; h: number; outer: THREE.Material; inner: THREE.Material };

/** A board panel with its hinge along local y = 0, extending along +y. Outer face is +z. */
function Panel({ w, h, outer, inner }: PanelProps) {
  const edge = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9bfae", roughness: 0.9 }), []);
  return (
    <mesh position={[0, h / 2, 0]} material={[edge, edge, edge, edge, outer, inner]}>
      <boxGeometry args={[w, h, T]} />
    </mesh>
  );
}

function useMaterials() {
  return useMemo(() => {
    const mat = (map: THREE.Texture) => new THREE.MeshStandardMaterial({ map, roughness: 0.62 });
    const textures = {
      // Taller panels are drawn at their own proportion so the logo keeps its shape.
      front: panelTexture({ w: 1024, h: Math.round((1024 * H) / W), bg: BRAND.terracotta, ink: BRAND.paper, scale: 0.42 }),
      // The back and base read correctly on the flattened sheet, which is where they're seen.
      back: panelTexture({ w: 1024, h: Math.round((1024 * H) / W), bg: BRAND.terracotta, ink: BRAND.paper, logo: "tagline", scale: 0.9, rotate: Math.PI }),
      side: panelTexture({ w: 1024, h: Math.round((1024 * H) / D), bg: BRAND.terracotta, ink: BRAND.paper, logo: "mark", scale: 0.4 }),
      lid: panelTexture({ w: 1024, h: Math.round((1024 * D) / W), bg: BRAND.terracotta, ink: BRAND.paper, scale: 0.46, rotate: Math.PI }),
      base: panelTexture({ w: 1024, h: Math.round((1024 * D) / W), bg: BRAND.terracotta, ink: BRAND.paper, logo: "tagline", scale: 1, rotate: Math.PI }),
      flap: panelTexture({ w: 1024, h: 180, bg: BRAND.terracotta, ink: BRAND.terracotta, logo: "none" }),
      inner: panelTexture({ w: 1024, h: 1024, bg: BRAND.sand, ink: "#d3c8b6", logo: "pattern" }),
      lidInner: panelTexture({ w: 1024, h: Math.round((1024 * D) / W), bg: BRAND.charcoal, ink: BRAND.paper, logo: "tagline", scale: 0.8 }),
    };
    return {
      textures,
      front: mat(textures.front),
      back: mat(textures.back),
      side: mat(textures.side),
      lid: mat(textures.lid),
      base: mat(textures.base),
      flap: mat(textures.flap),
      inner: mat(textures.inner),
      lidInner: mat(textures.lidInner),
    };
  }, []);
}

function Box({ state }: { state: SceneState }) {
  const m = useMaterials();
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Group>(null);
  const insert = useRef<THREE.Group>(null);
  const decal = useMemo(() => wordmarkDecal(BRAND.paper), []);

  useEffect(
    () => () => {
      Object.values(m.textures).forEach((t) => t.dispose());
      decal.dispose();
    },
    [m, decal],
  );

  useFrame(() => {
    const p = state.p;

    // 1. Closed box turns. 2. Lid opens, notebook lifts. 3. Walls unfold. 4. The flat sheet turns over.
    const open = ramp(p, 0.2, 0.42);
    const lift = ramp(p, 0.3, 0.46);
    const away = ramp(p, 0.46, 0.55);
    const flip = ramp(p, 0.78, 0.94);

    if (root.current) {
      root.current.rotation.y = keyframes(p, [[0, -2.3], [0.2, -0.55], [0.5, -0.3], [0.76, 0]]);
      root.current.rotation.x = -Math.PI * flip;
      root.current.position.y = Math.sin(flip * Math.PI) * 1.4;
      // The unfolded sheet is longer on the lid's side: keep it centred, before and after it turns over.
      root.current.position.z = ramp(p, 0.56, 0.76) * THREE.MathUtils.lerp(0.965, -0.965, flip);
    }
    // Walls fold down one after another, for a sense of it being opened by hand.
    const wf = ramp(p, 0.54, 0.68) * (Math.PI / 2);
    const wb = ramp(p, 0.6, 0.74) * (Math.PI / 2);
    const wl = ramp(p, 0.52, 0.64) * (Math.PI / 2);
    const wr = ramp(p, 0.56, 0.7) * (Math.PI / 2);
    if (front.current) front.current.rotation.x = wf;
    if (back.current) back.current.rotation.x = wb;
    if (left.current) left.current.rotation.x = wl;
    if (right.current) right.current.rotation.x = wr;
    // Lid is hinged to the back wall: closed folds it over the top, open swings it back.
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2, 0.22, open) * (1 - ramp(p, 0.6, 0.74)) ;
    if (flap.current) flap.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2, -0.15, open) * (1 - ramp(p, 0.6, 0.74));
    if (insert.current) {
      insert.current.visible = away < 0.999;
      insert.current.position.set(0, 0.1 + lift * 1.15, away * -0.2);
      insert.current.scale.setScalar(1 - away);
      insert.current.rotation.y = lift * 0.5;
    }

    // Distance at which a given width and height both fit (fov 24° gives 0.425 of visible height per unit).
    const aspect = size.width / size.height;
    const distFor = (w: number, h: number) => Math.max(h / 0.425, w / (0.425 * aspect));
    const pull = ramp(p, 0.5, 0.8);
    const dist = THREE.MathUtils.lerp(distFor(3.9, 4.1), distFor(5, 7.4), pull);
    const el = keyframes(p, [[0, 0.38], [0.3, 0.62], [0.55, 0.95], [0.8, 1.42], [1, 1.5]]);
    const ty = keyframes(p, [[0, 0.5], [0.4, 0.75], [0.8, 0.1]]);
    const a = state.px * 0.04;
    camera.position.set(dist * Math.sin(a) * Math.cos(el), ty + dist * Math.sin(el), dist * Math.cos(a) * Math.cos(el));
    camera.up.set(0, 1, 0);
    camera.lookAt(0, ty, 0);
  });

  return (
    <group ref={root}>
      {/* Base: inner printed side up. */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={[m.flap, m.flap, m.flap, m.flap, m.inner, m.base]}>
        <boxGeometry args={[W, D, T]} />
      </mesh>

      {/* Each wall sits on a base edge and folds outward around its own hinge. */}
      <group position={[0, 0, D / 2]}>
        <group ref={front}>
          <Panel w={W} h={H} outer={m.front} inner={m.inner} />
        </group>
      </group>
      <group position={[W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <group ref={right}>
          <Panel w={D} h={H} outer={m.side} inner={m.inner} />
        </group>
      </group>
      <group position={[-W / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <group ref={left}>
          <Panel w={D} h={H} outer={m.side} inner={m.inner} />
        </group>
      </group>
      <group position={[0, 0, -D / 2]} rotation={[0, Math.PI, 0]}>
        <group ref={back}>
          <Panel w={W} h={H} outer={m.back} inner={m.inner} />
          <group position={[0, H, 0]}>
            <group ref={lid}>
              <Panel w={W} h={D} outer={m.lid} inner={m.lidInner} />
              <group position={[0, D, 0]}>
                <group ref={flap}>
                  <Panel w={W * 0.96} h={0.28} outer={m.flap} inner={m.flap} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* What's inside: tissue and a notebook that lifts out. */}
      <group ref={insert}>
        <RoundedBox args={[1.05, 0.14, 1.45]} radius={0.015} smoothness={3} position={[0, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color={BRAND.deep} roughness={0.85} />
        </RoundedBox>
        <mesh position={[0, 0.142, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.86, 0.86 * 0.22]} />
          <meshStandardMaterial map={decal} transparent polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      </group>
    </group>
  );
}

export default function PackagingScene({ state, simple }: { state: SceneState; simple: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={simple ? [1, 1.5] : [1, 2]}
      camera={{ fov: 24, position: [0, 4, 10], near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.02 }}
      aria-hidden
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneBridge state={state} />
      <Box state={state} />
      {/* After the box: frame callbacks run in mount order, and shadows must see the final positions. */}
      <Studio shadows={!simple} shadowOpacity={0.34} shadowScale={22} />
    </Canvas>
  );
}
