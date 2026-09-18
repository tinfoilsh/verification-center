import { defineConfig } from "@playwright/test";

const TEST_PORT = 3003;
const TEST_BUILD_DIR = ".next-playwright";
const baseURL = `http://127.0.0.1:${TEST_PORT}`;

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  use: {
    baseURL,
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    env: { NEXT_BUILD_DIR: TEST_BUILD_DIR },
    command: `npx next dev --port ${TEST_PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
