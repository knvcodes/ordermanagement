// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    testTimeout: 15000,
  },
});
