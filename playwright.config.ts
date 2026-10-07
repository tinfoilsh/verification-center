import { defineConfig } from "@playwright/test";

const TEST_PORT = 3003;
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
  // Build the static export and serve it with the deployed CSP (see
  // scripts/serve-export.js), not `next dev`: the suite must see the same
  // HTML and policy as production. PLAYWRIGHT_SKIP_BUILD=1 reuses out/.
  webServer: {
    env: { GIT_HASH: "playwright" },
    command: `${process.env.PLAYWRIGHT_SKIP_BUILD ? "" : "npx next build && "}node scripts/serve-export.js ${TEST_PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
