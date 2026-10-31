// Imported by the page's main bundle, so this file must not import three or @react-three/fiber:
// they should only be downloaded when a scene comes close to the screen.

/** Scroll state shared between the DOM overlay and the WebGL scene, outside React. */
export type SceneState = {
  p: number;
  px: number;
  py: number;
  /** Requests a frame. Set by the scene once it has mounted. */
  invalidate?: () => void;
};

/** 0→1 with smooth ends between two points of progress. */
export function ramp(p: number, a: number, b: number) {
  if (p <= a) return 0;
  if (p >= b) return 1;
  const t = (p - a) / (b - a);
  return t * t * (3 - 2 * t);
}

/** Smooth interpolation through [progress, value] pairs. */
export function keyframes(p: number, frames: [number, number][]) {
  if (p <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    if (p <= frames[i][0]) {
      return frames[i - 1][1] + (frames[i][1] - frames[i - 1][1]) * ramp(p, frames[i - 1][0], frames[i][0]);
    }
  }
  return frames[frames.length - 1][1];
}

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
