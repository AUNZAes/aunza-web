"use client";

import { useLayoutEffect, useMemo, useRef, type ComponentProps, type RefObject } from "react";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BRAND, drawMark, drawWordmark, wordmarkDecal } from "../textures";

export const SEASON = { evergreen: "#2f4a3c", wine: "#7a2e35" };

const TEXTURES = {
  paper: "/images/christmas/XT1.webp",
  ribbon: "/images/christmas/XT2.webp",
  tissue: "/images/christmas/XT3.webp",
  linen: "/images/christmas/XT4.webp",
};

/** The shared material set for every Christmas scene, built on the campaign's tiling textures. */
export function useMaterials() {
  const t = useTexture(TEXTURES);
  return useMemo(() => {
    const tiled = (source: THREE.Texture, x: number, y: number, color = false) => {
      const tex = source.clone();
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(x, y);
      tex.anisotropy = 8;
      tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      tex.needsUpdate = true;
      return tex;
    };
    const board = (color: string, roughness = 0.72) =>
      new THREE.MeshStandardMaterial({ color, roughness, bumpMap: tiled(t.paper, 3, 3), bumpScale: 0.5 });
    return {
      board,
      ribbon: new THREE.MeshStandardMaterial({
        color: SEASON.wine,
        roughness: 0.42,
        metalness: 0.04,
        bumpMap: tiled(t.ribbon, 1, 40),
        bumpScale: 0.7,
        side: THREE.DoubleSide,
      }),
      tissue: new THREE.MeshStandardMaterial({
        color: "#f6efe3",
        roughness: 0.95,
        bumpMap: tiled(t.tissue, 1.5, 1),
        bumpScale: 1.4,
        side: THREE.DoubleSide,
      }),
      linen: new THREE.MeshStandardMaterial({ color: BRAND.deep, roughness: 0.86, bumpMap: tiled(t.linen, 3, 4), bumpScale: 0.8 }),
    };
  }, [t]);
}

export type Materials = ReturnType<typeof useMaterials>;

/** An open-topped rigid tray with its floor at y = 0. Used for box bases, liners and, upside down, lids. */
export function Tray({ w, d, h, t = 0.035, material }: { w: number; d: number; h: number; t?: number; material: THREE.Material }) {
  return (
    <group>
      <mesh position={[0, t / 2, 0]} material={material}>
        <boxGeometry args={[w, t, d]} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={`x${s}`} position={[0, h / 2, (s * (d - t)) / 2]} material={material}>
          <boxGeometry args={[w, h, t]} />
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <mesh key={`z${s}`} position={[(s * (w - t)) / 2, h / 2, 0]} material={material}>
          <boxGeometry args={[t, h, d - t * 2]} />
        </mesh>
      ))}
    </group>
  );
}

/** The wordmark lying on a surface, reading correctly from +z. */
export function FlatLogo({ width, color, ...props }: { width: number; color: string } & ComponentProps<"mesh">) {
  const map = useMemo(() => wordmarkDecal(color), [color]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <planeGeometry args={[width, width * 0.22]} />
      <meshStandardMaterial map={map} transparent depthWrite={false} roughness={0.7} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

export function bottleLabel(wave: string = BRAND.terracotta) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "#f1e9dc";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = wave;
  ctx.beginPath();
  ctx.moveTo(0, 860);
  ctx.bezierCurveTo(260, 830, 420, 760, 620, 640);
  ctx.bezierCurveTo(770, 550, 900, 500, 1024, 500);
  ctx.lineTo(1024, 1024);
  ctx.lineTo(0, 1024);
  ctx.closePath();
  ctx.fill();
  drawWordmark(ctx, 512, 300, 520, BRAND.charcoal);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function Bottle(props: ComponentProps<"group">) {
  const { glass, label } = useMemo(() => {
    const profile = [
      [0, 0], [0.26, 0], [0.285, 0.025], [0.285, 1.24], [0.27, 1.36], [0.19, 1.5], [0.115, 1.64], [0.1, 1.76], [0.1, 2.12], [0, 2.12],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return {
      glass: new THREE.LatheGeometry(profile, 64),
      label: bottleLabel(),
    };
  }, []);
  return (
    <group {...props}>
      <mesh geometry={glass}>
        <meshPhysicalMaterial color="#17120f" roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.5} />
      </mesh>
      {/* Label, centred on +z */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.74, 48, 1, true, -1.25, 2.5]} />
        <meshStandardMaterial map={label} roughness={0.85} />
      </mesh>
      {/* Capsule */}
      <mesh position={[0, 1.93, 0]}>
        <cylinderGeometry args={[0.108, 0.108, 0.4, 32]} />
        <meshStandardMaterial color={SEASON.wine} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Candle({ lightRef, flameRef, ...props }: { lightRef?: RefObject<THREE.PointLight | null>; flameRef?: RefObject<THREE.Sprite | null> } & ComponentProps<"group">) {
  const { vessel, flame, label } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const g = ctx.createRadialGradient(32, 84, 2, 32, 74, 50);
    g.addColorStop(0, "rgba(255,246,214,1)");
    g.addColorStop(0.3, "rgba(255,196,110,0.9)");
    g.addColorStop(0.7, "rgba(255,140,50,0.25)");
    g.addColorStop(1, "rgba(255,120,30,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(32, 6);
    ctx.bezierCurveTo(62, 60, 58, 120, 32, 122);
    ctx.bezierCurveTo(6, 120, 2, 60, 32, 6);
    ctx.fill();
    const profile = [[0, 0], [0.29, 0], [0.31, 0.03], [0.31, 0.58], [0.29, 0.6], [0.28, 0.46], [0, 0.46]].map(([x, y]) => new THREE.Vector2(x, y));
    return {
      vessel: new THREE.LatheGeometry(profile, 48),
      flame: new THREE.CanvasTexture(canvas),
      label: wordmarkDecal(BRAND.charcoal, 512),
    };
  }, []);
  return (
    <group {...props}>
      <mesh geometry={vessel}>
        <meshStandardMaterial color={BRAND.sage} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.47, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 40]} />
        <meshStandardMaterial color="#f7e9cc" emissive="#ffb765" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.07, 6]} />
        <meshStandardMaterial color="#2a2018" />
      </mesh>
      <sprite ref={flameRef} position={[0, 0.62, 0]} scale={[0.1, 0.2, 1]}>
        <spriteMaterial map={flame} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <pointLight ref={lightRef} position={[0, 0.8, 0]} color="#ffb060" intensity={0.9} distance={3.2} decay={2} />
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.313, 0.313, 0.12, 32, 1, true, -0.8, 1.6]} />
        <meshStandardMaterial map={label} transparent depthWrite={false} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Lying flat, spine on the left, with its origin on the underside. */
export function Notebook({ materials, cover, ...props }: { materials: Materials; cover?: THREE.Material } & ComponentProps<"group">) {
  const linen = cover ?? materials.linen;
  return (
    <group {...props}>
      <RoundedBox args={[0.95, 0.018, 1.3]} radius={0.008} smoothness={2} position={[0, 0.009, 0]} material={linen} />
      <mesh position={[0.008, 0.06, 0]}>
        <boxGeometry args={[0.92, 0.086, 1.27]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.95} />
      </mesh>
      <RoundedBox args={[0.95, 0.018, 1.3]} radius={0.008} smoothness={2} position={[0, 0.112, 0]} material={linen} />
      <mesh position={[0.36, 0.122, 0]}>
        <boxGeometry args={[0.028, 0.004, 1.3]} />
        <meshStandardMaterial color="#223850" roughness={0.9} />
      </mesh>
      <FlatLogo width={0.42} color="#1f3550" position={[-0.03, 0.1225, -0.02]} />
    </group>
  );
}

export function GreetingCard({ materials, ...props }: { materials: Materials } & ComponentProps<"group">) {
  const paper = useMemo(() => materials.board("#f4eee2", 0.9), [materials]);
  return (
    <group {...props}>
      <mesh position={[0, 0.008, 0]} material={paper}>
        <boxGeometry args={[0.98, 0.016, 0.68]} />
      </mesh>
      <FlatLogo width={0.34} color={BRAND.charcoal} position={[0, 0.0175, 0]} />
    </group>
  );
}

/** A wax seal with the mark pressed into it, lying flat. */
export function WaxSeal(props: ComponentProps<"group">) {
  const top = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = SEASON.wine;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#5e2027";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(128, 128, 96, 0, Math.PI * 2);
    ctx.stroke();
    drawMark(ctx, 128, 128, 150, "#561c23");
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  return (
    <group {...props}>
      <mesh position={[0, 0.016, 0]}>
        <cylinderGeometry args={[0.135, 0.15, 0.032, 24]} />
        <meshStandardMaterial attach="material-0" color={SEASON.wine} roughness={0.4} />
        <meshStandardMaterial attach="material-1" map={top} roughness={0.38} />
        <meshStandardMaterial attach="material-2" color={SEASON.wine} roughness={0.4} />
      </mesh>
    </group>
  );
}

const ANGLE = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/** A fresh fir sprig lying along +x: a stem, side shoots and instanced needles. */
export function FirSprig({ length = 1.1, density = 1, ...props }: { length?: number; density?: number } & ComponentProps<"group">) {
  const needles = useRef<THREE.InstancedMesh>(null);
  const { stems, count, cone } = useMemo(() => {
    const branch = (from: THREE.Vector3, dir: THREE.Vector3, len: number) => {
      const bend = new THREE.Vector3(0, 0.03, (Math.random() - 0.5) * 0.12).multiplyScalar(len);
      return new THREE.QuadraticBezierCurve3(from.clone(), from.clone().addScaledVector(dir, len / 2).add(bend), from.clone().addScaledVector(dir, len));
    };
    const main = branch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), length);
    const curves = [main];
    for (const t of [0.3, 0.48, 0.66]) {
      for (const side of [1, -1]) {
        curves.push(branch(main.getPoint(t), new THREE.Vector3(0.72, 0, side * 0.7).normalize(), length * (0.62 - t * 0.45)));
      }
    }
    const geometry = new THREE.ConeGeometry(0.008, 0.11, 3);
    geometry.translate(0, 0.05, 0);
    return {
      stems: curves,
      count: Math.round(curves.reduce((n, c) => n + c.getLength() * 230, 0) * density),
      cone: geometry,
    };
  }, [length, density]);

  useLayoutEffect(() => {
    const mesh = needles.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const dark = new THREE.Color("#1e3a2a");
    const light = new THREE.Color("#3f6548");
    const color = new THREE.Color();
    const total = stems.reduce((n, c) => n + c.getLength(), 0);
    let i = 0;
    for (const curve of stems) {
      const n = Math.round((curve.getLength() / total) * count);
      for (let k = 0; k < n && i < count; k++, i++) {
        const t = k / n;
        const tangent = curve.getTangent(t);
        const side = k % 2 ? 1 : -1;
        // Needles sweep forward along the stem, mostly in the plane of the sprig.
        ANGLE.set(tangent.z * side, 0.18 + Math.random() * 0.3, -tangent.x * side)
          .multiplyScalar(0.8)
          .addScaledVector(tangent, 0.72)
          .normalize();
        dummy.position.copy(curve.getPoint(t));
        dummy.quaternion.setFromUnitVectors(UP, ANGLE);
        dummy.scale.setScalar(0.72 + Math.random() * 0.5);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, color.copy(dark).lerp(light, Math.random()));
      }
    }
    mesh.count = i;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [stems, count]);

  return (
    <group {...props}>
      {stems.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 10, i ? 0.006 : 0.011, 5]} />
          <meshStandardMaterial color="#5a3d26" roughness={0.9} />
        </mesh>
      ))}
      <instancedMesh ref={needles} args={[cone, undefined, count]}>
        <meshStandardMaterial roughness={0.62} />
      </instancedMesh>
    </group>
  );
}

/** A pine cone lying on its side, built from instanced scales in a natural spiral. */
export function PineCone({ size = 1, ...props }: { size?: number } & ComponentProps<"group">) {
  const scales = useRef<THREE.InstancedMesh>(null);
  const COUNT = 74;
  const scale = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 7, 5);
    g.scale(0.062, 0.018, 0.078);
    g.translate(0, 0, 0.06);
    return g;
  }, []);
  useLayoutEffect(() => {
    const mesh = scales.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const dark = new THREE.Color("#3f2616");
    const light = new THREE.Color("#8a5c35");
    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);
      const angle = i * 2.39996;
      const radius = 0.14 * Math.sin(Math.PI * (0.08 + 0.84 * t)) ** 0.75 + 0.015;
      dummy.position.set(Math.sin(angle) * radius * 0.5, 0.38 * t - 0.19, Math.cos(angle) * radius * 0.5);
      dummy.rotation.set(0.55 - t * 0.9, angle, 0, "YXZ");
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.copy(dark).lerp(light, Math.random()));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);
  return (
    <group scale={size} {...props}>
      <group position={[0, 0.13, 0]} rotation={[0, 0, Math.PI / 2 - 0.08]}>
        <instancedMesh ref={scales} args={[scale, undefined, COUNT]}>
          <meshStandardMaterial roughness={0.75} />
        </instancedMesh>
      </group>
    </group>
  );
}

export function OrangeSlice({ radius = 0.16, ...props }: { radius?: number } & ComponentProps<"group">) {
  const face = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "#8f4a16";
    ctx.beginPath();
    ctx.arc(128, 128, 126, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eab36f";
    ctx.beginPath();
    ctx.arc(128, 128, 112, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const wedge = (Math.PI * 2) / 10 - 0.08;
      ctx.fillStyle = i % 2 ? "#c9741f" : "#d4811f";
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(a + wedge / 2) * 12, 128 + Math.sin(a + wedge / 2) * 12);
      ctx.arc(128, 128, 102, a, a + wedge);
      ctx.closePath();
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  return (
    <group {...props}>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[radius, radius, 0.024, 32]} />
        <meshStandardMaterial attach="material-0" color="#8f4a16" roughness={0.8} />
        <meshStandardMaterial attach="material-1" map={face} roughness={0.7} />
        <meshStandardMaterial attach="material-2" map={face} roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * A crumpled sheet of tissue paper, flat on the XZ plane, hinged along z = 0 and extending
 * towards -z (or +z with a negative depth).
 */
export function tissueGeometry(width: number, depth: number) {
  const g = new THREE.PlaneGeometry(width, Math.abs(depth), 30, 16);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, depth < 0 ? depth / 2 : depth / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const fold = Math.abs(z) / Math.abs(depth);
    const y =
      (Math.sin(x * 6.1 + z * 3.3) * 0.016 + Math.sin(x * 15 - z * 11) * 0.007 + Math.sin(z * 9 + x * 2.2) * 0.014) * (0.35 + fold) +
      fold * 0.05;
    pos.setY(i, y);
  }
  g.computeVertexNormals();
  return g;
}
