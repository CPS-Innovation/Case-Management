import { Page, expect } from "@playwright/test";

export class SuspectASNPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is the Arrest Summons Number (ASN)?",
    );
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-asn-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-asn-text-link")).toHaveText(
      "Enter the Arrest Summons Number (ASN)",
    );
    await this.page.getByTestId("suspect-asn-text-link").click();
    await expect(this.page.locator("#suspect-asn-text")).toBeFocused();
  }
  async addASNText(value: string) {
    await this.page.locator("#suspect-asn-text").fill(value);
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
