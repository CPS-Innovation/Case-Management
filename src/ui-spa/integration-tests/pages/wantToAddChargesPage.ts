import { Page, expect } from "@playwright/test";

export class WantToAddChargesPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/want-to-add-charges",
    );
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Do you want to add charges for the suspect?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("want-to-add-charges-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("want-to-add-charges-radio-link"),
    ).toHaveText("Select whether you need to add charges for the suspect");
    await this.page.getByTestId("want-to-add-charges-radio-link").click();
    await expect(
      this.page.locator("#want-to-add-charges-radio-yes"),
    ).toBeFocused();
  }
  async selectAddChargesYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectAddChargesNo() {
    await this.page.getByLabel(/^No$/).check();
  }
  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
