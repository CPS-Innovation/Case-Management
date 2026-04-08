import { Page, expect } from "@playwright/test";

export class SuspectDisabilityPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Does POTTER, Harry have a disability?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-disability-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-disability-radio-link"),
    ).toHaveText("Select whether the defendant has a disability");
    await this.page.getByTestId("suspect-disability-radio-link").click();
    await expect(
      this.page.locator("#suspect-disability-radio-yes"),
    ).toBeFocused();
  }
  async selectDisabilityYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectDisabilityNo() {
    await this.page.getByLabel(/^No$/).check();
  }
  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
