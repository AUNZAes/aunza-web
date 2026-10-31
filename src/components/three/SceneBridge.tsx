"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { SceneState } from "./scene-utils";

/** Lets scroll handlers outside the canvas request frames, and draws once with the current scroll. */
export function SceneBridge({ state }: { state: SceneState }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    state.invalidate = () => invalidate();
    invalidate();
    return () => {
      state.invalidate = undefined;
    };
  }, [state, invalidate]);
  return null;
}
