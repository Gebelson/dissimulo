import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@alibi/contracts": path.resolve(__dirname, "./packages/contracts/src/index.ts"),
      "@alibi/game-engine": path.resolve(__dirname, "./packages/game-engine/src/index.ts"),
      "@alibi/minigames": path.resolve(__dirname, "./packages/minigames/src/index.ts"),
      "@alibi/location": path.resolve(__dirname, "./packages/location/src/index.ts"),
      "@alibi/evidence-engine": path.resolve(__dirname, "./packages/evidence-engine/src/index.ts"),
    },
  },
  test: {
    globals: true,
  },
});
