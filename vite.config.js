import { defineConfig } from "vite";

// Vite handles the "optimize assets" requirement out of the box:
//   - JS is minified (esbuild) and split per dynamic import (see router.js)
//   - CSS is minified and extracted
//   - Images referenced with `new URL(..., import.meta.url)` are hashed,
//     copied to /dist/assets, and cache-busted automatically
//   - `vite build` produces a production-ready /dist folder to deploy
export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
  },
});
