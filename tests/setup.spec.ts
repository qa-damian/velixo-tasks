import { test } from "@playwright/test";
import { MicrosoftLoginPage } from "../models/pages/MicrosoftLoginPage";

test("login to Excel Online and save session", async ({ page }, info) => {
  const msPage = new MicrosoftLoginPage(page);
  const cfg: any = info.project.use;

  if (!cfg.login) test.skip();

  await page.goto(cfg.sheetUrl, { waitUntil: "domcontentloaded" });
  await msPage.login(cfg.msUsername, cfg.msPassword);
  await page.context().storageState({ path: "auth.json" });
});
