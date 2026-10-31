import * as THREE from "three";
import { MARK_PATH, WORDMARK_PATH, WORDMARK_STROKE, WORDMARK_VIEWBOX } from "@/lib/logo";

export const BRAND = {
  charcoal: "#1f1f1f",
  sand: "#ede7de",
  terracotta: "#d97862",
  sage: "#7f9d8e",
  deep: "#2e4a6b",
  paper: "#f8f7f3",
  peach: "#e9a48f",
  darkSage: "#4f6d5e",
};

type Ctx = CanvasRenderingContext2D;

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d") as Ctx };
}

function toTexture(canvas: HTMLCanvasElement, anisotropy = 8) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

export function drawWordmark(ctx: Ctx, cx: number, cy: number, width: number, color: string) {
  const s = width / WORDMARK_VIEWBOX.width;
  ctx.save();
  ctx.translate(cx - width / 2, cy - (WORDMARK_VIEWBOX.height * s) / 2);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = WORDMARK_STROKE;
  ctx.lineJoin = "round";
  const path = new Path2D(WORDMARK_PATH);
  ctx.fill(path);
  ctx.stroke(path);
  ctx.restore();
}

export function drawMark(ctx: Ctx, cx: number, cy: number, size: number, color: string) {
  const s = size / 100;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  const path = new Path2D(MARK_PATH);
  ctx.fill(path);
  ctx.stroke(path);
  ctx.restore();
}

function drawTagline(ctx: Ctx, cx: number, cy: number, size: number, color: string, text = "IDEAS MADE REAL.") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px ${getComputedStyle(document.body).fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${size * 0.42}px`;
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

/** Organic cut-paper shape, in the language of the board's cup and tote. */
function blob(ctx: Ctx, color: string, x: number, y: number, s: number, rot: number, variant = 0) {
  const shapes = [
    "M-92 -18 C-80 -92 16 -112 72 -66 C122 -24 112 62 52 88 C-8 114 -104 62 -92 -18Z",
    "M-46 -104 C-6 -128 44 -92 42 -38 C40 12 86 28 74 76 C62 122 -6 118 -30 76 C-52 38 -92 -76 -46 -104Z",
    "M-104 28 C-92 -36 -20 -62 34 -46 C80 -32 118 -18 110 30 C102 76 34 62 -14 76 C-62 90 -112 80 -104 28Z",
  ];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(shapes[variant % shapes.length]));
  ctx.restore();
}

export type CupTextures = { logo: THREE.CanvasTexture; graphics: THREE.CanvasTexture; bump: THREE.CanvasTexture };

/**
 * Cup artwork, as two alpha layers the shader prints separately:
 * logo: an alpha mask (front wordmark, back mark and tagline) the shader tints.
 * graphics: the coloured wrap of organic shapes.
 * u = 0.5 faces the camera at rest. Artwork crossing u = 0/1 is drawn twice so the wrap is seamless.
 */
export function createCupTextures(size = 2048): CupTextures {
  const w = size;
  const h = size / 2;

  const logo = makeCanvas(w, h);
  drawWordmark(logo.ctx, w * 0.5, h * 0.42, w * 0.2, "#fff");
  for (const x of [0, w]) {
    drawMark(logo.ctx, x, h * 0.36, h * 0.18, "#fff");
    drawTagline(logo.ctx, x, h * 0.52, h * 0.022, "#fff");
  }

  const gfx = makeCanvas(w, h);
  const k = h / 1024;
  const shapes: [string, number, number, number, number, number][] = [
    [BRAND.terracotta, 0.36, 0.8, 3.5, 0.3, 0],
    [BRAND.sage, 0.58, 0.86, 2.6, 1.1, 2],
    [BRAND.peach, 0.47, 0.98, 1.5, 0.5, 0],
    [BRAND.terracotta, 0.82, 0.74, 2.8, 2.4, 1],
    [BRAND.sage, 0.14, 0.86, 3, -0.6, 2],
    [BRAND.peach, 0.97, 0.9, 2.1, 0.2, 0],
    [BRAND.sage, 0.76, 0.14, 1.7, 0.8, 1],
    [BRAND.terracotta, 0.2, 0.1, 1.9, 1.4, 2],
    [BRAND.peach, 0.62, 0.05, 1.1, 2.0, 0],
  ];
  for (const [color, x, y, s, rot, v] of shapes) {
    for (const dx of [-w, 0, w]) blob(gfx.ctx, color, x * w + dx, y * h, s * k, rot, v);
  }

  return { logo: toTexture(logo.canvas), graphics: toTexture(gfx.canvas), bump: paperBump() };
}

/** Fine paper fibre noise, tiled, for bump maps. */
export function paperBump(size = 512) {
  const { canvas, ctx } = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + Math.random() * 20;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // A few long soft fibres.
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#fff";
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

/** Simple branded flat panel: a background with a centred wordmark, mark or tagline. */
export function panelTexture(opts: {
  w?: number;
  h?: number;
  bg: string;
  ink: string;
  logo?: "wordmark" | "mark" | "tagline" | "pattern" | "none";
  scale?: number;
  rotate?: number;
  blobs?: boolean;
  y?: number;
}) {
  const { w = 1024, h = 1024, bg, ink, logo = "wordmark", scale = 0.5, rotate = 0, blobs = false, y = 0.5 } = opts;
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rotate);
  ctx.translate(-w / 2, -h / 2);
  if (blobs) {
    blob(ctx, BRAND.terracotta, w * 0.2, h * 0.86, (w / 512) * 1.1, 0.3, 0);
    blob(ctx, BRAND.sage, w * 0.82, h * 0.82, (w / 512) * 1, 1.1, 2);
  }
  if (logo === "wordmark") drawWordmark(ctx, w / 2, h * y, w * scale, ink);
  if (logo === "mark") drawMark(ctx, w / 2, h * y, Math.min(w, h) * scale, ink);
  if (logo === "tagline") drawTagline(ctx, w / 2, h * y, h * 0.03 * (scale / 0.5), ink);
  if (logo === "pattern") {
    const step = Math.min(w, h) / 6;
    for (let row = 0; row * step < h + step; row++) {
      for (let col = 0; col * step < w + step; col++) {
        drawMark(ctx, col * step + (row % 2 ? step / 2 : 0), row * step, step * 0.46, ink);
      }
    }
  }
  return toTexture(canvas);
}

/** Transparent decal with the wordmark, for placing on curved or angled surfaces. */
export function wordmarkDecal(color: string, width = 1024) {
  const h = Math.round(width * 0.22);
  const { canvas, ctx } = makeCanvas(width, h);
  drawWordmark(ctx, width / 2, h / 2, width * 0.96, color);
  return toTexture(canvas);
}
