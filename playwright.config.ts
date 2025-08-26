import { defineConfig, devices } from "@playwright/test";
import * as fs from "fs";
const env = JSON.parse(fs.readFileSync("playwright.env.json", "utf-8"));

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    launchOptions: {
      args: [
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    },
  },
  projects: [
    {
      name: "setup",
      testMatch: /setup\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        ...env,
      },
    },
    {
      name: "e2e",
      testIgnore: /setup\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "auth.json",
        ...env,
        permissions: ["clipboard-read", "clipboard-write"],
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      },
    },
  ],
});
