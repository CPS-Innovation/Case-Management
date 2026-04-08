import { Page, expect } from "@playwright/test";

export class FirstHearingDetailsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/first-hearing",
    );
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Do you have details of the first hearing?",
    );
    await expect(this.page.getByLabel("Yes")).toBeVisible();
    await expect(this.page.getByLabel("No")).toBeVisible();
    await this.selectAddFirstHearingDetailsNo();
    await expect(
      this.page.locator("#conditional-first-hearing-radio-yes"),
    ).not.toBeVisible();
    await this.selectAddFirstHearingDetailsYes();
    await expect(
      this.page.locator("#conditional-first-hearing-radio-yes"),
    ).toBeVisible();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("first-hearing-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("first-hearing-radio-link")).toHaveText(
      "Select if you need to add first hearing details",
    );
    await this.page.getByTestId("first-hearing-radio-link").click();
    await expect(this.page.locator("#first-hearing-radio-yes")).toBeFocused();
    await this.selectAddFirstHearingDetailsYes();
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("first-hearing-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("first-hearing-court-location-text-link"),
    ).toHaveText("Select a location");
    await this.page
      .getByTestId("first-hearing-court-location-text-link")
      .click();
    await expect(
      this.page.locator("#first-hearing-court-location-text"),
    ).toBeFocused();
    await expect(
      this.page.getByTestId("first-hearing-date-text-link"),
    ).toHaveText("Enter the date");
    await this.page.getByTestId("first-hearing-date-text-link").click();
    await expect(this.page.locator("#first-hearing-date-text")).toBeFocused();
    await this.selectAddFirstHearingDetailsYes();
    await this.saveAndContinue();
  }
  async enterFirstHearingCourtLocation(name: string) {
    await this.page.locator("#first-hearing-court-location-text").fill(name);
    await this.page.keyboard.press("Escape");
  }

  async addFirstHearingDate(value: string) {
    await this.page.getByLabel(/^Date$/).fill(value);
  }

  async selectAddFirstHearingDetailsYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectAddFirstHearingDetailsNo() {
    await this.page.getByLabel(/^No$/).check();
  }
  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
