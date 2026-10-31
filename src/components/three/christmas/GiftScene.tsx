"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { keyframes, ramp, type SceneState } from "../scene-utils";
import { BRAND } from "../textures";
import { ChristmasCanvas, setPose, useShadows } from "./shared";
import { Bottle, Candle, FirSprig, FlatLogo, GreetingCard, Notebook, OrangeSlice, PineCone, Tray, WaxSeal, tissueGeometry, useMaterials } from "./parts";

// The gift box, in scene units. Its floor is at y = 0.
const W = 2.6;
const D = 1.9;
const H = 0.82;
const LID_H = 0.3;
const WALL = 0.035;
const TOP = H + 0.03 + WALL * 2 + 0.004;
const RIBBON = 0.17;

/**
 * One half of a ribbon band, running from the knot along the lid and down the side of the box.
 * As `release` goes 0→1 it slides off, from the knot outwards, and falls onto the table with a
 * natural wave. Vertices are recomputed each frame: there are few of them, and it looks like cloth.
 */
function RibbonHalf({ along, across, reach, state, material, delay }: { along: [number, number]; across: [number, number]; reach: number; state: SceneState; material: THREE.Material; delay: number }) {
  const SEGMENTS = 36;
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array((SEGMENTS + 1) * 6);
    const uvs = new Float32Array((SEGMENTS + 1) * 4);
    const index: number[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      uvs.set([0, i / SEGMENTS, 1, i / SEGMENTS], i * 4);
      if (i < SEGMENTS) {
        const a = i * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex(index);
    return g;
  }, []);
  const lastRelease = useRef(-1);

  useFrame(() => {
    const release = ramp(state.p, 0.2 + delay, 0.36 + delay);
    if (release === lastRelease.current) return;
    lastRelease.current = release;
    const length = reach + TOP;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= SEGMENTS; i++) {
      const s = i / SEGMENTS;
      const run = s * length;
      // Where this point sits on the box.
      const wrappedOut = Math.min(run, reach + 0.012);
      const wrappedY = run <= reach ? TOP : Math.max(TOP - (run - reach), 0.006);
      // Where it lands on the table, a little clear of the box.
      const landedOut = reach + 0.14 + run * 0.62;
      const wave = Math.sin(s * 6 + delay * 40) * 0.07 * s;
      // The part nearest the knot leaves first. It clears the edge of the box before it drops.
      const e = ramp(release, (1 - s) * 0.02 + s * 0.4, (1 - s) * 0.6 + s * 1);
      const slide = ramp(e, 0, 0.55);
      const drop = ramp(e, 0.4, 1);
      const out = THREE.MathUtils.lerp(wrappedOut, landedOut, slide);
      const y = THREE.MathUtils.lerp(wrappedY, 0.006 + Math.sin(s * 11) * 0.005, drop);
      const side = wave * e;
      const cx = along[0] * out + across[0] * side;
      const cz = along[1] * out + across[1] * side;
      pos.setXYZ(i * 2, cx + (across[0] * RIBBON) / 2, y, cz + (across[1] * RIBBON) / 2);
      pos.setXYZ(i * 2 + 1, cx - (across[0] * RIBBON) / 2, y, cz - (across[1] * RIBBON) / 2);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}

function Stage({ state, simple }: { state: SceneState; simple: boolean }) {
  const materials = useMaterials();
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const box = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Group>(null);
  const flapFront = useRef<THREE.Group>(null);
  const flapBack = useRef<THREE.Group>(null);
  const bottle = useRef<THREE.Group>(null);
  const candle = useRef<THREE.Group>(null);
  const notebook = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const decorLeft = useRef<THREE.Group>(null);
  const decorRight = useRef<THREE.Group>(null);
  const candleLight = useRef<THREE.PointLight>(null);
  const candleFlame = useRef<THREE.Sprite>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  const m = useMemo(
    () => ({
      outer: materials.board("#d07a62"),
      liner: materials.board("#efe5d4", 0.9),
    }),
    [materials],
  );
  const tissue = useMemo(() => ({ front: tissueGeometry(W - 0.16, -(D - 0.14) / 2), back: tissueGeometry(W - 0.16, (D - 0.14) / 2) }), []);

  useShadows(root);

  useFrame(() => {
    const p = state.p;
    const portrait = size.width / size.height < 1;
    const spread = portrait ? 0.56 : 1;

    // The whole set turns to face the viewer while the box is still closed.
    if (root.current) root.current.rotation.y = keyframes(p, [[0, -0.72], [0.36, 0]]);

    if (knot.current) {
      const undone = ramp(p, 0.17, 0.24);
      knot.current.scale.setScalar(Math.max(1 - undone, 0.0001));
      knot.current.visible = undone < 1;
    }

    setPose(
      lid.current,
      [
        { t: 0.38, p: [0, H + 0.03 + WALL, 0], r: [0, 0, 0] },
        { t: 0.46, p: [0, H + 1.05, -0.1], r: [0.12, 0, 0] },
        { t: 0.56, p: [0, 0.98, -1.72], r: [1.2, 0, 0] },
      ],
      p,
    );

    const open = ramp(p, 0.47, 0.58);
    if (flapFront.current) {
      flapFront.current.rotation.x = open * 2.72;
      flapFront.current.position.y = H - 0.05 + open * 0.06;
    }
    if (flapBack.current) {
      flapBack.current.rotation.x = open * -2.72;
      flapBack.current.position.y = H - 0.06 + open * 0.06;
    }

    // Products rise one by one, turn, and settle around the box.
    const R = spread;
    setPose(
      bottle.current,
      [
        { t: 0.56, p: [-1.02, 0.34, 0.42], r: [0, 0, -Math.PI / 2] },
        { t: 0.65, p: [-0.5, 1.35, 0.25], r: [0, 0.9, -0.5] },
        { t: 0.76, p: [-1.95 * R, 0, 0.45], r: [0, 0.18, 0] },
        { t: 0.86, p: [-1.95 * R, 0, 0.45], r: [0, 0.18, 0] },
        { t: 0.98, p: [0, 0, 0.5], r: [0, 0, 0] },
      ],
      p,
    );
    setPose(
      candle.current,
      [
        { t: 0.58, p: [0.75, 0.05, -0.42], r: [0, 0, 0] },
        { t: 0.67, p: [0.95, 1.25, -0.1], r: [0.2, 0.6, -0.15] },
        { t: 0.78, p: [1.95 * R, 0, 0.5], r: [0, -0.3, 0] },
        { t: 0.86, p: [1.95 * R, 0, 0.5], r: [0, -0.3, 0] },
        { t: 0.97, p: [7, 0, 0.8], r: [0, -0.3, 0] },
      ],
      p,
    );
    setPose(
      notebook.current,
      [
        { t: 0.6, p: [-0.42, 0.05, -0.42], r: [0, 0, 0] },
        { t: 0.69, p: [-0.3, 1.25, 0.2], r: [0.9, -0.3, 0.2] },
        { t: 0.8, p: [-0.62 * R, 0, 1.38], r: [0, 0.32, 0] },
        { t: 0.86, p: [-0.62 * R, 0, 1.38], r: [0, 0.32, 0] },
        { t: 0.97, p: [-7, 0, 2], r: [0, 0.32, 0] },
      ],
      p,
    );
    setPose(
      card.current,
      [
        { t: 0.62, p: [-0.42, 0.18, -0.42], r: [0, 0, 0] },
        { t: 0.71, p: [0.5, 1.05, 0.5], r: [1.1, -0.2, -0.2] },
        { t: 0.81, p: [0.72 * R, 0, 1.42], r: [0, -0.22, 0] },
        { t: 0.86, p: [0.72 * R, 0, 1.42], r: [0, -0.22, 0] },
        { t: 0.97, p: [7, 0, 2.4], r: [0, -0.22, 0] },
      ],
      p,
    );

    const lit = ramp(p, 0.62, 0.68);
    if (candleLight.current) candleLight.current.intensity = lit * 0.9;
    if (candleFlame.current) candleFlame.current.visible = lit > 0;

    // The box and lid move back to make room, then the bottle is left on its own.
    if (box.current) {
      box.current.position.z = keyframes(p, [[0.6, 0], [0.78, -1.0], [0.86, -1.0], [0.98, -2.4]]);
      box.current.position.x = keyframes(p, [[0.86, 0], [0.98, 11]]);
    }
    const leave = ramp(p, 0.86, 0.97);
    if (decorLeft.current) decorLeft.current.position.x = -6 * leave;
    if (decorRight.current) decorRight.current.position.x = 6 * leave;

    // A single continuous camera move: closer, down into the box, out over the set, in on the bottle.
    const aspect = size.width / size.height;
    const distFor = (w: number, h: number) => Math.max(h / 0.425, w / (0.425 * aspect));
    const dist = keyframes(p, [
      [0, distFor(5.2, 4.4)],
      [0.3, distFor(4.4, 3.9)],
      [0.46, distFor(4.6, 5.2)],
      [0.6, distFor(4.8, 6)],
      [0.72, distFor(5.4, 6)],
      [0.8, distFor(portrait ? 4.6 : 6.8, 5.4)],
      [0.86, distFor(portrait ? 4.6 : 6.8, 5.4)],
      [1, distFor(2.5, 4.1)],
    ]);
    const elevation = keyframes(p, [[0, 0.3], [0.3, 0.36], [0.5, 0.62], [0.6, 0.72], [0.8, 0.34], [1, 0.1]]);
    const azimuth = keyframes(p, [[0, 0.1], [0.4, -0.08], [0.8, 0.04], [1, 0]]) + state.px * 0.035;
    target.set(0, keyframes(p, [[0, 0.22], [0.46, 0.72], [0.6, 0.52], [0.8, 0.42], [1, 0.82]]), keyframes(p, [[0.6, 0], [0.8, 0.3], [1, 0.5]]));
    camera.position.set(
      target.x + dist * Math.sin(azimuth) * Math.cos(elevation),
      target.y + dist * Math.sin(elevation) - state.py * 0.05,
      target.z + dist * Math.cos(azimuth) * Math.cos(elevation),
    );
    camera.lookAt(target);
  });

  const density = simple ? 0.55 : 1;

  return (
    <group ref={root}>
      <group ref={box}>
        <Tray w={W} d={D} h={H} t={WALL} material={m.outer} />
        <group position={[0, WALL, 0]}>
          <Tray w={W - WALL * 2.2} d={D - WALL * 2.2} h={H - WALL - 0.02} t={0.012} material={m.liner} />
        </group>

        {/* Tissue paper, folded over the contents from both long sides */}
        <group ref={flapFront} position={[0, H + 0.006, (D - 0.14) / 2]}>
          <mesh geometry={tissue.front} material={materials.tissue} />
          <WaxSeal position={[0, 0.045, -(D - 0.14) / 2 + 0.12]} />
        </group>
        <group ref={flapBack} position={[0, H - 0.004, -(D - 0.14) / 2]}>
          <mesh geometry={tissue.back} material={materials.tissue} />
        </group>

        {/* Lid: the tray, upside down, with its top at y = 0 of this group */}
        <group ref={lid}>
          <group rotation={[Math.PI, 0, 0]} position={[0, WALL, 0]}>
            <Tray w={W + 0.05} d={D + 0.05} h={LID_H} t={WALL} material={m.outer} />
          </group>
          <FlatLogo width={0.72} color={BRAND.paper} position={[0.5, WALL + 0.002, 0.46]} />
        </group>

        {/* Ribbon: two bands crossing at the knot */}
        <RibbonHalf along={[1, 0]} across={[0, 1]} reach={W / 2 + 0.03} state={state} material={materials.ribbon} delay={0} />
        <RibbonHalf along={[-1, 0]} across={[0, 1]} reach={W / 2 + 0.03} state={state} material={materials.ribbon} delay={0.01} />
        <RibbonHalf along={[0, 1]} across={[1, 0]} reach={D / 2 + 0.03} state={state} material={materials.ribbon} delay={0.02} />
        <RibbonHalf along={[0, -1]} across={[1, 0]} reach={D / 2 + 0.03} state={state} material={materials.ribbon} delay={0.03} />

        <group ref={knot} position={[0, TOP + 0.02, 0]}>
          <RoundedBox args={[0.2, 0.09, 0.15]} radius={0.04} smoothness={3} material={materials.ribbon} />
          <FirSprig length={0.95} density={density} position={[-0.42, 0.015, 0.2]} rotation={[0, 0.45, 0]} />
          <RoundedBox args={[0.13, 0.006, 0.42]} radius={0.003} smoothness={1} material={materials.ribbon} position={[0.1, -0.03, 0.26]} rotation={[0, -0.32, 0]} />
          <RoundedBox args={[0.13, 0.006, 0.42]} radius={0.003} smoothness={1} material={materials.ribbon} position={[-0.11, -0.03, 0.25]} rotation={[0, 0.42, 0]} />
        </group>
      </group>

      <group ref={bottle}><Bottle /></group>
      <group ref={candle}><Candle lightRef={candleLight} flameRef={candleFlame} /></group>
      <group ref={notebook}><Notebook materials={materials} /></group>
      <group ref={card}><GreetingCard materials={materials} /></group>

      {/* Fir, pine cones and dried orange around the set, as in the campaign photographs */}
      <group ref={decorLeft}>
        <FirSprig length={1.2} density={density} position={[-2.95, 0.03, 0.2]} rotation={[0, -0.2, 0]} />
        <PineCone position={[-1.72, 0, 0.42]} rotation={[0, 0.6, 0]} size={0.78} />
        <OrangeSlice position={[-2.1, 0, 0.68]} radius={0.14} />
      </group>
      <group ref={decorRight}>
        <FirSprig length={1.25} density={density} position={[2.8, 0.03, 0.85]} rotation={[0, 3.5, 0]} />
        <PineCone position={[1.72, 0, 1.25]} rotation={[0, -0.4, 0]} size={0.78} />
        <PineCone position={[2.1, 0, 0.62]} rotation={[0, 1.1, 0]} size={0.68} />
        <OrangeSlice position={[1.32, 0, 1.62]} radius={0.14} />
      </group>
    </group>
  );
}

export default function GiftScene({ state, simple }: { state: SceneState; simple: boolean }) {
  return (
    <ChristmasCanvas state={state} simple={simple}>
      <Stage state={state} simple={simple} />
    </ChristmasCanvas>
  );
}
