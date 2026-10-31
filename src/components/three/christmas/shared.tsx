"use client";

import { Suspense, useLayoutEffect, useMemo, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SceneBridge } from "../SceneBridge";
import { keyframes, ramp, type SceneState } from "../scene-utils";

export type V3 = [number, number, number];
export type Pose = { t: number; p: V3; r: V3 };

/** Drives a group smoothly through a list of timed poses. */
export function setPose(group: THREE.Object3D | null, poses: Pose[], progress: number) {
  if (!group) return;
  const channel = (select: (pose: Pose) => number) => keyframes(progress, poses.map((pose) => [pose.t, select(pose)] as [number, number]));
  group.position.set(channel((q) => q.p[0]), channel((q) => q.p[1]), channel((q) => q.p[2]));
  group.rotation.set(channel((q) => q.r[0]), channel((q) => q.r[1]), channel((q) => q.r[2]));
}

/** Distance at which a width and height both fit, with the 24° lens every Christmas scene uses. */
export const fitDistance = (width: number, height: number, aspect: number) => Math.max(height / 0.425, width / (0.425 * aspect));

/** Places the camera around a target, by distance, elevation and azimuth. */
export function aimCamera(camera: THREE.Camera, target: THREE.Vector3, distance: number, elevation: number, azimuth: number) {
  camera.position.set(
    target.x + distance * Math.sin(azimuth) * Math.cos(elevation),
    target.y + distance * Math.sin(elevation),
    target.z + distance * Math.cos(azimuth) * Math.cos(elevation),
  );
  camera.lookAt(target);
}

/** Every opaque mesh under the group casts and receives shadows. Decals stay out of it. */
export function useShadows(root: RefObject<THREE.Object3D | null>) {
  useLayoutEffect(() => {
    root.current?.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && !(mesh.material as THREE.Material).transparent) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [root]);
}

/**
 * A ribbon laid over a box from the knot to the table, which unrolls from the table up and over:
 * `grow` goes 0→1 between the two points of progress. `from` is the far end, on the table.
 */
export function RibbonWrap({ along, across, reach, top, width = 0.17, state, material, window: [a, b] }: { along: [number, number]; across: [number, number]; reach: number; top: number; width?: number; state: SceneState; material: THREE.Material; window: [number, number] }) {
  const SEGMENTS = 40;
  const geometry = useMemo(() => {
    const length = reach + top;
    const positions: number[] = [];
    const uvs: number[] = [];
    const index: number[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const s = i / SEGMENTS;
      const run = s * length;
      const out = Math.min(run, reach);
      const y = run <= reach ? top : Math.max(top - (run - reach), 0.006);
      for (const side of [1, -1]) {
        positions.push(along[0] * out + (side * across[0] * width) / 2, y, along[1] * out + (side * across[1] * width) / 2);
      }
      uvs.push(0, s, 1, s);
      if (i < SEGMENTS) {
        const v = i * 2;
        index.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
  }, [along, across, reach, top, width]);

  useFrame(() => {
    const shown = Math.round(ramp(state.p, a, b) * SEGMENTS);
    geometry.setDrawRange((SEGMENTS - shown) * 6, shown * 6);
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}

/** The warm winter evening every Christmas scene shares: light, reflections, and shadows on the table. */
export function ChristmasCanvas({ state, simple, children, cameraPosition = [0, 3, 9], clipping = false }: { state: SceneState; simple: boolean; children: ReactNode; cameraPosition?: V3; clipping?: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={simple ? [1, 1.5] : [1, 2]}
      shadows="percentage"
      camera={{ fov: 24, position: cameraPosition, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1 }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = clipping;
      }}
      aria-hidden
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneBridge state={state} />
      <Suspense fallback={null}>{children}</Suspense>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#b8aa9a"]} />
        <Lightformer form="rect" intensity={2.2} position={[7, 3.5, 4]} scale={[8, 7, 1]} rotation={[0, -Math.PI / 3, 0]} color="#ffe9cf" />
        <Lightformer form="rect" intensity={0.9} position={[-7, 3, 3]} scale={[6, 8, 1]} rotation={[0, Math.PI / 3, 0]} color="#ffeeda" />
        <Lightformer form="rect" intensity={1.1} position={[0, 9, 0]} scale={[12, 12, 1]} rotation={[Math.PI / 2, 0, 0]} color="#fff2e0" />
      </Environment>
      <directionalLight
        position={[6, 6.5, 3.5]}
        intensity={1.25}
        color="#ffe6c6"
        castShadow
        shadow-mapSize={simple ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-far={24}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.26} color="#3a2412" />
      </mesh>
      {simple ? null : <ContactShadows position={[0, 0, 0]} scale={18} resolution={768} blur={2.4} far={2.5} opacity={0.34} color="#3a2412" />}
    </Canvas>
  );
}
