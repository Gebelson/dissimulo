import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@alibi/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.ts"),
      "@alibi/game-engine": path.resolve(__dirname, "../../packages/game-engine/src/index.ts"),
      "@alibi/minigames": path.resolve(__dirname, "../../packages/minigames/src/index.ts"),
      "@alibi/location": path.resolve(__dirname, "../../packages/location/src/index.ts"),
      "@alibi/evidence-engine": path.resolve(__dirname, "../../packages/evidence-engine/src/index.ts"),
    },
  },
  server: {
    port: 3000,
    host: true, // accessible on local network (Wi-Fi)
  },
});
