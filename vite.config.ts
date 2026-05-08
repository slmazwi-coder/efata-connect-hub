import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  // We ensure Vite doesn't look for index.html as the primary entry point
  // during the TanStack Start build phase.
  build: {
    emptyOutDir: true,
  }
});
