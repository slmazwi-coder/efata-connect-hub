import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { 
      // This path must be relative to the root where this file sits
      entry: "api/index.ts",
      preset: "vercel" 
    },
  }
});
