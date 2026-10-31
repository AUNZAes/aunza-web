"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SceneBridge } from "./SceneBridge";
import { Studio } from "./Studio";
import { BRAND, createCupTextures, panelTexture, paperBump, wordmarkDecal, type CupTextures } from "./textures";
import { keyframes, ramp, type SceneState } from "./scene-utils";

const CUP_H = 1.95;
const R_TOP = 0.74;
const R_BOTTOM = 0.53;

const c = (hex: string) => new THREE.Color(hex);

// Colourways the cup passes through: [progress, body, logo, lid].
const WAYS: [number, THREE.Color, THREE.Color, THREE.Color][] = [
  [0.3, c("#f4f1ea"), c(BRAND.charcoal), c("#f4f1ea")],
  [0.35, c(BRAND.terracotta), c(BRAND.paper), c(BRAND.charcoal)],
  [0.39, c(BRAND.terracotta), c(BRAND.paper), c(BRAND.charcoal)],
  [0.42, c(BRAND.sage), c(BRAND.paper), c(BRAND.charcoal)],
  [0.44, c(BRAND.sage), c(BRAND.paper), c(BRAND.charcoal)],
  [0.47, c(BRAND.deep), c(BRAND.paper), c(BRAND.paper)],
  [0.49, c(BRAND.deep), c(BRAND.paper), c(BRAND.paper)],
  [0.53, c(BRAND.paper), c(BRAND.charcoal), c(BRAND.charcoal)],
];

function sampleWay(p: number, idx: 1 | 2 | 3, out: THREE.Color) {
  if (p <= WAYS[0][0]) return out.copy(WAYS[0][idx]);
  for (let i = 1; i < WAYS.length; i++) {
    if (p <= WAYS[i][0]) {
      const t = (p - WAYS[i - 1][0]) / (WAYS[i][0] - WAYS[i - 1][0]);
      return out.copy(WAYS[i - 1][idx]).lerp(WAYS[i][idx], t * t * (3 - 2 * t));
    }
  }
  return out.copy(WAYS[WAYS.length - 1][idx]);
}

function useCupMaterial(textures: CupTextures) {
  return useMemo(() => {
    const uniforms = {
      uBase: { value: c("#f4f1ea") },
      uLogoColor: { value: c(BRAND.charcoal) },
      uLogoMap: { value: textures.logo },
      uGfxMap: { value: textures.graphics },
      uLogo: { value: 0 },
      uGfx: { value: 0 },
    };
    const mat = new THREE.MeshStandardMaterial({ color: "#fff", roughness: 0.62, bumpMap: textures.bump, bumpScale: 0.35 });
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec2 vArtUv;")
        .replace("#include <uv_vertex>", "#include <uv_vertex>\nvArtUv = uv;");
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec2 vArtUv;
          uniform vec3 uBase; uniform vec3 uLogoColor;
          uniform sampler2D uLogoMap; uniform sampler2D uGfxMap;
          uniform float uLogo; uniform float uGfx;
          float artNoise(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          vec3 art = uBase;
          // Graphics spread outward from the front of the cup, with a slightly irregular edge.
          float gDist = abs(vArtUv.x - 0.5) * 2.0 + artNoise(floor(vArtUv * 220.0)) * 0.035;
          float gMask = 1.0 - smoothstep(uGfx * 1.15 - 0.09, uGfx * 1.15, gDist);
          vec4 gfx = texture2D(uGfxMap, vArtUv);
          art = mix(art, gfx.rgb, gfx.a * gMask * step(0.001, uGfx));
          // The logo prints from the bottom of the mark upward.
          float lMask = 1.0 - smoothstep(uLogo * 1.1 - 0.04, uLogo * 1.1, 1.0 - (vArtUv.y - 0.3) / 0.4);
          float logoA = texture2D(uLogoMap, vArtUv).a;
          art = mix(art, uLogoColor, logoA * lMask * step(0.001, uLogo));
          diffuseColor.rgb = art;`,
        );
    };
    return { mat, uniforms };
  }, [textures]);
}

function lidGeometry() {
  // Profile of a moulded takeaway lid, from the centre outward.
  const pts = [
    [0, 0.2], [0.42, 0.2], [0.47, 0.19], [0.5, 0.15], [0.53, 0.12], [0.6, 0.11], [0.68, 0.1], [0.71, 0.085],
    [0.725, 0.05], [0.775, 0.045], [0.79, 0.02], [0.79, -0.05], [0.77, -0.085], [0.745, -0.09],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 96);
}

function Cup({ textures, groupRef, state }: { textures: CupTextures; groupRef: React.RefObject<THREE.Group | null>; state: SceneState }) {
  const { mat, uniforms } = useCupMaterial(textures);
  const lidMat = useRef<THREE.MeshStandardMaterial>(null);
  const lid = useMemo(lidGeometry, []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const p = state.p;
    uniforms.uLogo.value = ramp(p, 0.16, 0.28);
    uniforms.uGfx.value = ramp(p, 0.52, 0.64);
    sampleWay(p, 1, uniforms.uBase.value);
    sampleWay(p, 2, uniforms.uLogoColor.value);
    if (lidMat.current) lidMat.current.color.copy(sampleWay(p, 3, tmp));
  });

  return (
    <group ref={groupRef}>
      {/* Open cylinder rotated so that u = 0.5 of the artwork faces +Z. */}
      <mesh position={[0, CUP_H / 2 + 0.02, 0]} material={mat}>
        <cylinderGeometry args={[R_TOP, R_BOTTOM, CUP_H, 128, 1, true, Math.PI]} />
      </mesh>
      {/* Rolled base */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R_BOTTOM, 0.02, 12, 96]} />
        <meshStandardMaterial color="#e9e4d9" roughness={0.7} />
      </mesh>
      <mesh position={[0, CUP_H + 0.09, 0]} geometry={lid}>
        <meshStandardMaterial ref={lidMat} color="#f4f1ea" roughness={0.42} side={THREE.DoubleSide} />
      </mesh>
      {/* Sip hole */}
      <mesh position={[0, CUP_H + 0.296, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.022, 0.07, 6, 16]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PaperBag({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const W = 1.5;
  const H = 2.15;
  const D = 0.62;
  const { body, handle, decal, bump } = useMemo(() => {
    // A cross-section with folded side gussets, extruded upward.
    const g = 0.14;
    const s = new THREE.Shape();
    s.moveTo(-W / 2, -D / 2);
    s.lineTo(W / 2, -D / 2);
    s.lineTo(W / 2 - g, 0);
    s.lineTo(W / 2, D / 2);
    s.lineTo(-W / 2, D / 2);
    s.lineTo(-W / 2 + g, 0);
    s.closePath();
    const body = new THREE.ExtrudeGeometry(s, { depth: H, bevelEnabled: false });
    body.rotateX(-Math.PI / 2);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, 0, 0),
      new THREE.Vector3(-0.28, 0.42, 0),
      new THREE.Vector3(0, 0.6, 0),
      new THREE.Vector3(0.28, 0.42, 0),
      new THREE.Vector3(0.3, 0, 0),
    ]);
    return {
      body,
      handle: new THREE.TubeGeometry(curve, 48, 0.014, 8),
      decal: wordmarkDecal(BRAND.paper),
      bump: paperBump(256),
    };
  }, []);

  return (
    <group ref={groupRef}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#2a2928" roughness={0.56} bumpMap={bump} bumpScale={0.25} flatShading />
      </mesh>
      {/* Open top */}
      <mesh position={[0, H + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.98, D * 0.98]} />
        <meshStandardMaterial color="#0b0b0b" roughness={1} />
      </mesh>
      {/* Top fold band */}
      <mesh position={[0, H - 0.12, D / 2 + 0.002]}>
        <planeGeometry args={[W, 0.004]} />
        <meshStandardMaterial color="#454443" />
      </mesh>
      <mesh position={[0, H * 0.58, D / 2 + 0.004]}>
        <planeGeometry args={[W * 0.56, W * 0.56 * 0.22]} />
        <meshStandardMaterial map={decal} transparent roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      <mesh geometry={handle} position={[0, H - 0.02, D / 2 - 0.03]}>
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh geometry={handle} position={[0, H - 0.02, -D / 2 + 0.03]}>
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
    </group>
  );
}

function TakeawayBox({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const H = 0.74;
  const RT = 0.86;
  const RB = 0.66;
  const slope = Math.atan((RT - RB) / H);
  const faceZ = ((RT + RB) / 2) * Math.SQRT1_2 + 0.003;
  const { decal, wire } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, -0.16, 0),
      new THREE.Vector3(-0.36, 0.26, 0),
      new THREE.Vector3(0, 0.42, 0),
      new THREE.Vector3(0.36, 0.26, 0),
      new THREE.Vector3(0.6, -0.16, 0),
    ]);
    return { decal: wordmarkDecal(BRAND.charcoal), wire: new THREE.TubeGeometry(curve, 48, 0.008, 8) };
  }, []);
  const topW = RT * Math.SQRT2;

  return (
    <group ref={groupRef}>
      {/* Tapered four-sided carton */}
      <mesh position={[0, H / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[RT, RB, H, 4, 1]} />
        <meshStandardMaterial color={BRAND.terracotta} roughness={0.68} flatShading />
      </mesh>
      <mesh position={[0, H * 0.5, faceZ]} rotation={[slope, 0, 0]}>
        <planeGeometry args={[0.76, 0.76 * 0.22]} />
        <meshStandardMaterial map={decal} transparent roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      {/* Two roof flaps meeting at the ridge */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[0, H + 0.14, (side * topW) / 4]} rotation={[side * 0.55, 0, 0]}>
          <boxGeometry args={[topW, 0.012, topW / 2 / Math.cos(0.55)]} />
          <meshStandardMaterial color={BRAND.terracotta} roughness={0.68} />
        </mesh>
      ))}
      {[1, -1].map((side) => (
        <mesh key={side} position={[(side * topW) / 2, H + 0.13, 0]} rotation={[0, (side * Math.PI) / 2, 0]}>
          <shapeGeometry
            args={[
              new THREE.Shape([
                new THREE.Vector2(-topW / 2, -0.14),
                new THREE.Vector2(topW / 2, -0.14),
                new THREE.Vector2(0, 0.15),
              ]),
            ]}
          />
          <meshStandardMaterial color="#c6684f" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh geometry={wire} position={[0, H + 0.1, 0]}>
        <meshStandardMaterial color="#9a9a9a" metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Napkins({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const S = 0.92;
  const { top, bump } = useMemo(
    () => ({ top: panelTexture({ w: 1024, h: 1024, bg: BRAND.sage, ink: BRAND.paper, logo: "mark", scale: 0.26, y: 0.5 }), bump: paperBump(256) }),
    [],
  );
  const rots = [0.04, -0.03, 0.07, -0.05, 0.02, 0];
  return (
    <group ref={groupRef}>
      {rots.map((r, i) => (
        <RoundedBox key={i} args={[S, 0.028, S]} radius={0.012} smoothness={3} position={[0, 0.016 + i * 0.03, 0]} rotation={[0, r, 0]}>
          <meshStandardMaterial color={BRAND.sage} roughness={0.92} bumpMap={bump} bumpScale={0.4} />
        </RoundedBox>
      ))}
      <mesh position={[0, 0.016 + 5 * 0.03 + 0.0145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[S * 0.985, S * 0.985]} />
        <meshStandardMaterial map={top} roughness={0.92} bumpMap={bump} bumpScale={0.4} />
      </mesh>
      {/* Fold line */}
      <mesh position={[0, 0.016 + 5 * 0.03 + 0.0155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[S * 0.985, 0.003]} />
        <meshStandardMaterial color="#6c8a7b" />
      </mesh>
    </group>
  );
}

function Rig({ state, textures }: { state: SceneState; textures: CupTextures }) {
  const { camera, size } = useThree();
  const cup = useRef<THREE.Group>(null);
  const bag = useRef<THREE.Group>(null);
  const box = useRef<THREE.Group>(null);
  const nap = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = state.p;
    const portrait = size.width / size.height < 1;
    // Keep the subject filling the frame on narrow screens.
    const fit = Math.max(1, 0.62 / (size.width / size.height));

    // The cup rotates on its own at first, then the camera takes a full orbit around it.
    if (cup.current) {
      cup.current.rotation.y = keyframes(p, [[0, -1.5], [0.15, -0.35], [0.3, 0], [0.52, 0.05], [1, -0.28]]);
      const slide = ramp(p, 0.66, 0.84);
      // Starts off to one side of the opening text, then moves to the centre of the stage.
      const enter = portrait ? 0 : keyframes(p, [[0, 1.05], [0.1, 0]]);
      cup.current.position.set(enter + (portrait ? 0 : 0.04 * slide), 0, 0.22 * slide);
    }

    const orbit = keyframes(p, [[0, 0], [0.52, 0], [0.655, Math.PI * 2]]);
    const pull = ramp(p, 0.66, 0.86);
    const dist = THREE.MathUtils.lerp(9.4, portrait ? 11.2 : 15.2, pull) * THREE.MathUtils.lerp(fit, fit * (portrait ? 1.4 : 1), pull);
    const el = keyframes(p, [[0, 0.08], [0.52, 0.12], [0.6, 0.3], [0.66, 0.12], [0.86, 0.2], [1, 0.26]]);
    // On portrait screens the opening text sits above the cup, so the frame starts higher.
    const open = portrait ? keyframes(p, [[0, 0.95], [0.1, 0]]) : 0;
    // The final set sits low in the frame, leaving the top clear for the closing line.
    const ty = THREE.MathUtils.lerp(1.2, portrait ? 1.7 : 1.62, pull) + open;
    target.set(0, ty, 0);
    const a = orbit + state.px * 0.05 + keyframes(p, [[0.86, 0], [1, -0.14]]);
    camera.position.set(
      target.x + dist * Math.sin(a) * Math.cos(el),
      target.y + dist * Math.sin(el) - state.py * 0.08,
      target.z + dist * Math.cos(a) * Math.cos(el),
    );
    camera.lookAt(target);

    // The set arrives one piece at a time and settles around the cup.
    const place = (g: THREE.Group | null, start: number, from: number[], to: number[], rotFrom: number, rotTo: number) => {
      if (!g) return;
      const t = ramp(p, start, start + 0.13);
      g.visible = t > 0.001;
      g.position.set(
        THREE.MathUtils.lerp(from[0], to[0], t),
        THREE.MathUtils.lerp(from[1], to[1], t),
        THREE.MathUtils.lerp(from[2], to[2], t),
      );
      g.rotation.y = THREE.MathUtils.lerp(rotFrom, rotTo, t);
      g.scale.setScalar(portrait ? 0.86 : 1);
    };
    place(bag.current, 0.66, [-5, 0, -2], portrait ? [-1.0, 0, -0.95] : [-1.65, 0, -0.5], -0.9, 0.34);
    place(box.current, 0.7, [5, 0, -1], portrait ? [1.08, 0, -0.42] : [1.72, 0, -0.32], 1.1, -0.42);
    place(nap.current, 0.74, [2.5, 0, 5], portrait ? [0.62, 0, 1.25] : [0.96, 0, 0.92], 0.8, -0.2);
  });

  return (
    <>
      <Cup textures={textures} groupRef={cup} state={state} />
      <PaperBag groupRef={bag} />
      <TakeawayBox groupRef={box} />
      <Napkins groupRef={nap} />
    </>
  );
}

function Textures({ state, simple }: { state: SceneState; simple: boolean }) {
  const textures = useMemo(() => createCupTextures(simple ? 1024 : 2048), [simple]);
  useEffect(
    () => () => {
      textures.logo.dispose();
      textures.graphics.dispose();
      textures.bump.dispose();
    },
    [textures],
  );
  return <Rig state={state} textures={textures} />;
}

export default function CupScene({ state, simple }: { state: SceneState; simple: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={simple ? [1, 1.5] : [1, 2]}
      camera={{ fov: 24, position: [0, 1.2, 9.4], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.02 }}
      aria-hidden
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneBridge state={state} />
      <Textures state={state} simple={simple} />
      {/* After the products: frame callbacks run in mount order, and shadows must see the final positions. */}
      <Studio shadows={!simple} />
    </Canvas>
  );
}
