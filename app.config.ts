import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { 
      // Pointing to your new location
      entry: "api/index.ts",
      preset: "vercel" 
    },
  }
});
