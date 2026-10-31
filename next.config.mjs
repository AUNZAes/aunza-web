import { DEVICE_SIZES, IMAGE_SIZES } from "./scripts/image-widths.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Published as plain files on GitHub Pages. Forms go to the Worker in worker/forms.js.
  output: "export",
  trailingSlash: true,
  // The dev server and the production build each keep their own folder, so one can never break the other.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Workspace root sits above other projects; pin tracing to this folder.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [92],
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
  },
  experimental: {
    optimizePackageImports: ["@react-three/drei"],
  },
};

export default nextConfig;
