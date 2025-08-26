import { Page, Locator, expect, FrameLocator } from "@playwright/test";

export class MicrosoftExcelSheetPage {
  readonly page: Page;
  readonly excelIframe: FrameLocator;
  readonly clipBoardBtn: Locator;
  readonly copyBtn: Locator;
  readonly nameBoxInput: Locator;
  readonly copyKey: String;

  constructor(page: Page) {
    this.page = page;
    this.excelIframe = page.frameLocator("#WacFrame_Excel_0");
    this.clipBoardBtn = this.excelIframe.locator("#Clipboard");
    this.copyBtn = this.excelIframe.locator("[name='Copy']");
    this.nameBoxInput = this.excelIframe.locator("#FormulaBar-NameBox-input");
    this.copyKey = process.platform === "darwin" ? "Meta+C" : "Control+C";
  }

  // would be in the basepage just didn't write one for this
  async goto(page: Page, url: string) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async getCellText(page: Page, cell: string): Promise<string> {
    const maxRetries = 10;
    const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    let attempt = 0;
    let clipboardText = "";

    await this.nameBoxInput.waitFor({ state: "visible", timeout: 20000 });

    while (attempt < maxRetries) {
      await this.nameBoxInput.click();
      await this.nameBoxInput.fill(cell);
      await this.nameBoxInput.press("Enter");
      await this.clipBoardBtn.click();
      await this.copyBtn.waitFor({ state: "visible", timeout: 20000 });
      await this.copyBtn.click();

      clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });

      if (clipboardText.includes("Retrieving data. Wait a few seconds and try to cut or copy again.")) {
        console.log(`Got "Retrieving data" message on attempt ${attempt}, waiting and retrying...`);
        await page.waitForTimeout(3000); // Wait 3 seconds as Excel suggests
        continue;
      } else if (
        clipboardText &&
        clipboardText !== "CLEARED" &&
        clipboardText.trim() !== "" &&
        datePattern.test(clipboardText.trim())
      ) {
        console.log(`Success on attempt ${attempt}! Got: "${clipboardText}"`);
        return clipboardText.trim();
      } else {
        console.log(`Got empty result on attempt ${attempt}, retrying...`);
        await page.waitForTimeout(3000);
        continue;
      }
    }
    return clipboardText.trim();
  }
}
