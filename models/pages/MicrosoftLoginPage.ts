import { Page, Locator, expect } from "@playwright/test";

export class MicrosoftLoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  readonly emailNextBtn: Locator;
  readonly passwordNextBtn: Locator;
  readonly staySignedInNoBtn: Locator;

  readonly workOrSchoolAccountOption: Locator;
  readonly personalAccountOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="loginfmt"]');
    this.passwordInput = page.locator('input[name="passwd"]');
    this.passwordNextBtn = page.locator('button[data-testid="primaryButton"]');
    this.emailNextBtn = page.locator('input[type="submit"]');

    this.staySignedInNoBtn = page.getByRole("button", { name: /^no$/i });
    this.workOrSchoolAccountOption = page.getByRole("link", {
      name: /Sign in with the account provided by your work or school/i,
    });
    this.personalAccountOption = page.getByText(/personal account/i).first();
  }

  async login(username: string, password: string): Promise<void> {
    await this.clickIfVisible(this.workOrSchoolAccountOption);
    await this.clickIfVisible(this.personalAccountOption);

    await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
    await this.emailInput.fill(username);
    await this.emailNextBtn.click();

    await expect(this.passwordInput).toBeVisible({ timeout: 15000 });
    await this.passwordInput.fill(password);
    await this.page.pause();
    await this.passwordNextBtn.click();

    await this.page.waitForURL(/(excel|office|onedrive)\./i, { timeout: 30000 });
  }

  private async clickIfVisible(locator: Locator, timeout = 3000): Promise<void> {
    try {
      if (await locator.isVisible({ timeout })) {
        await locator.click();
      }
    } catch {
      // do nothing if not visible
    }
  }

  private async fillIfVisible(locator: Locator, text: string, timeout = 3000): Promise<void> {
    try {
      if (await locator.isVisible({ timeout })) {
        await locator.fill(text);
      }
    } catch {
      // do nothing if not visible
    }
  }
}
