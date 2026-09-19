import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3006",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    env: { SLLP_VISUAL_TEST: "1" },
    command: "npm run dev -- --hostname localhost --port 3006",
    url: "http://localhost:3006",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
