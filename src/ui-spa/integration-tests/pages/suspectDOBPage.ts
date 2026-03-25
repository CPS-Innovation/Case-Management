import { Page, expect } from "@playwright/test";

export class SuspectDOBPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is POTTER, Harry's date of birth?",
    );
    await expect(this.page.locator(".govuk-hint ")).toHaveText(
      "For example, 27 3 2007",
    );
    await expect(
      this.page.getByTestId("suspect-DOB-date").locator("label").nth(0),
    ).toHaveText("Day");
    await expect(
      this.page.getByTestId("suspect-DOB-date").locator("label").nth(1),
    ).toHaveText("Month");
    await expect(
      this.page.getByTestId("suspect-DOB-date").locator("label").nth(2),
    ).toHaveText("Year");
  }

  async errorValidations() {
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-DOB-day-text-link")).toHaveText(
      "Date of birth must be a valid date",
    );
    await this.page.getByTestId("suspect-DOB-day-text-link").click();
    await expect(this.page.locator("#suspect-DOB-day-text")).toBeFocused();
    this.addDOBDay("32");
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-DOB-day-text-link")).toHaveText(
      "Date of birth must be a valid date",
    );
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-DOB-day-text-link")).toHaveText(
      "Date of birth must be a valid date",
    );
    await this.page.getByTestId("suspect-DOB-day-text-link").click();
    await expect(this.page.locator("#suspect-DOB-day-text")).toBeFocused();
    this.addDOBDay("3");
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-month-text-link"),
    ).toHaveText("Date of birth must be a valid date");
    await this.page.getByTestId("suspect-DOB-month-text-link").click();
    await expect(this.page.locator("#suspect-DOB-month-text")).toBeFocused();

    this.addDOBMonth("13");
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-month-text-link"),
    ).toHaveText("Date of birth must be a valid date");
    this.addDOBMonth("11");
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-year-text-link"),
    ).toHaveText("Date of birth must be a valid date");
    await this.page.getByTestId("suspect-DOB-year-text-link").click();
    await expect(this.page.locator("#suspect-DOB-year-text")).toBeFocused();
    this.addDOBYear("20");
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-year-text-link"),
    ).toHaveText("Date of birth must be a valid date");
  }

  async addDOBDay(day: string) {
    await this.page.getByLabel("Day").fill(day);
  }
  async addDOBMonth(month: string) {
    await this.page.getByLabel("Month").fill(month);
  }
  async addDOBYear(year: string) {
    await this.page.getByLabel("Year").fill(year);
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
