import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@dissimulo/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.ts"),
      "@dissimulo/game-engine": path.resolve(__dirname, "../../packages/game-engine/src/index.ts"),
      "@dissimulo/minigames": path.resolve(__dirname, "../../packages/minigames/src/index.ts"),
      "@dissimulo/location": path.resolve(__dirname, "../../packages/location/src/index.ts"),
      "@dissimulo/evidence-engine": path.resolve(__dirname, "../../packages/evidence-engine/src/index.ts"),
      "@alibi/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.ts"),
      "@alibi/game-engine": path.resolve(__dirname, "../../packages/game-engine/src/index.ts"),
      "@alibi/minigames": path.resolve(__dirname, "../../packages/minigames/src/index.ts"),
      "@alibi/location": path.resolve(__dirname, "../../packages/location/src/index.ts"),
      "@alibi/evidence-engine": path.resolve(__dirname, "../../packages/evidence-engine/src/index.ts"),
    },
  },
  server: {
    port: 3000,
    host: true, // accessible on local network (Wi-Fi: 0.0.0.0)
    proxy: {
      // Proxy WebSockets through port 3000 to backend on 4000 (eliminates firewall issues on LAN)
      "/ws": {
        target: "ws://localhost:4000",
        ws: true,
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
