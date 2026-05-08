// vite.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
var vite_config_default = defineConfig({
  vite: {
    plugins: [tsConfigPaths()]
  }
});
export {
  vite_config_default as default
};
