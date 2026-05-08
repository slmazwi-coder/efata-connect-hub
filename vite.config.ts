import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsconfigPaths()
  ],
  build: {
    // Explicitly setting output for Vercel
    outDir: ".output/public",
    emptyOutDir: true,
  }
});
