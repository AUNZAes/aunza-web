/** Points next/image at the sizes made by scripts/build-image-sizes.mjs. In development it shows the original. */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`;
  return `${src.replace(/^\/images\//, "/images/w/").replace(/\.\w+$/, "")}-${width}.webp`;
}
