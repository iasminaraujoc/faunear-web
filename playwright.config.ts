import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: /.*\.spec\.ts/,
  timeout: 30_000,
  expect: {
    timeout: 5000,
  },
  use: {
    actionTimeout: 5000,
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "npx tsx src/server.ts",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
