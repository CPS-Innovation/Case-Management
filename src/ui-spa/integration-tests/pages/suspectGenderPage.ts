import { Page, expect } from "@playwright/test";

export class SuspectGenderPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is POTTER, Harry's gender?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Male");
    await expect(this.page.locator("label").nth(1)).toHaveText("Female");
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-gender-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-gender-radio-link")).toHaveText(
      "Select a gender",
    );
    await this.page.getByTestId("suspect-gender-radio-link").click();
    await expect(this.page.locator("#suspect-gender-radio-0")).toBeFocused();
  }
  async selectGenderMale() {
    await this.page.getByLabel(/^Male$/).check();
  }
  async selectGenderFemale() {
    await this.page.getByLabel(/^Female$/).check();
  }
  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
