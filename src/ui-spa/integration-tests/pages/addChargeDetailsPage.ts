import { Page, expect } from "@playwright/test";

export class AddChargeDetailsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements(name: string, charge: string) {
    await expect(this.page.locator("h1")).toHaveText("Add charges");
    await expect(this.page.locator("h2").nth(0)).toHaveText(name);
    await expect(this.page.locator("h2").nth(1)).toHaveText(charge);
    await expect(
      this.page
        .getByTestId("add-charge-details-dates-inputs")
        .getByText("When was the offence?"),
    ).toBeVisible();
    await expect(this.page.getByTestId("offence-from-date-text")).toBeVisible();
    await expect(
      this.page.getByTestId("offence-to-date-text"),
    ).not.toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Date range" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Single date" }),
    ).not.toBeVisible();
    await this.clickDateRange();
    await expect(this.page.getByTestId("offence-to-date-text")).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Date range" }),
    ).not.toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Single date" }),
    ).toBeVisible();
    await this.clickSingleDate();
    await expect(
      this.page.getByTestId("offence-to-date-text"),
    ).not.toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Date range" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Single date" }),
    ).not.toBeVisible();
    await expect(this.page.locator("fieldset legend")).toHaveText(
      "Is there a victim?",
    );
    await expect(this.page.getByLabel("Yes")).toBeVisible();
    await expect(this.page.getByLabel("No")).toBeVisible();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("charges-details-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("offence-from-date-text-link"),
    ).toHaveText("Select an offence from date");
    await expect(this.page.getByTestId("add-victim-radio-link")).toHaveText(
      "Please select an option",
    );
    await this.page.getByTestId("offence-from-date-text-link").click();
    await expect(this.page.locator("#offence-from-date-text")).toBeFocused();
    await this.page.getByTestId("add-victim-radio-link").click();
    await expect(this.page.locator("#add-victim-radio-yes")).toBeFocused();
    await this.clickDateRange();
    await this.saveAndContinue();
    await expect(this.page.getByTestId("offence-to-date-text-link")).toHaveText(
      "Select an offence to date",
    );
    await this.page.getByTestId("offence-to-date-text-link").click();
    await expect(this.page.locator("#offence-to-date-text")).toBeFocused();
    await this.fillOffenceFromDate("2022-02-02");
    await this.fillOffenceToDate("2022-02-01");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("offence-from-date-text-link"),
    ).toHaveText("Start date must be the same or before the end date.");
    await this.page.getByTestId("offence-from-date-text-link").click();
    await expect(this.page.locator("#offence-from-date-text")).toBeFocused();
    await expect(
      this.page.getByTestId("offence-to-date-text-link"),
    ).not.toBeVisible();
    await this.fillOffenceToDate("2022-02-03");

    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("offence-from-date-text-link"),
    ).not.toBeVisible();
    await expect(
      this.page.getByTestId("offence-to-date-text-link"),
    ).not.toBeVisible();
    await this.fillOffenceToDate("2022-02-01");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("offence-from-date-text-link"),
    ).toHaveText("Start date must be the same or before the end date.");
    await this.clickSingleDate();
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("offence-from-date-text-link"),
    ).not.toBeVisible();
    await expect(
      this.page.getByTestId("offence-to-date-text-link"),
    ).not.toBeVisible();
  }
  async clickDateRange() {
    await this.page.getByRole("button", { name: "Date range" }).click();
  }
  async clickSingleDate() {
    await this.page.getByRole("button", { name: "Single date" }).click();
  }
  async fillOffenceFromDate(date: string) {
    await this.page.locator("#offence-from-date-text").fill(date);
  }
  async fillOffenceToDate(date: string) {
    await this.page.locator("#offence-to-date-text").fill(date);
  }
  async selectAddVictimYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectAddVictimNo() {
    await this.page.getByLabel(/^No$/).check();
  }
  async verifyBackLink(url) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }
  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
