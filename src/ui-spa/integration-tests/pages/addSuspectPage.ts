import { Page, expect } from "@playwright/test";

export class AddSuspectPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyBasePageElements() {
    await expect(this.page.locator("h1")).toHaveText("Add a suspect");
    await expect(this.page.locator(".govuk-hint ").nth(0)).toHaveText(
      "Choose the type of suspect you want to add",
    );
  }

  async verifyAdditionalElements() {
    await expect(this.page.locator("legend").nth(1)).toHaveText(
      "Do you want to add any additional details about this suspect?",
    );
    const labels = await this.page
      .getByTestId("suspect-additional-details-checkboxes")
      .locator(`label`)
      .allInnerTexts();
    expect(labels).toEqual([
      "Date of birth",
      "Gender",
      "Disability",
      "Religion",
      "Ethnicity",
      "Alias details",
      "Arrest Summons Number (ASN)",
      "Type of offender",
    ]);
  }

  async errorValidations() {
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("add-suspect-radio-link")).toHaveText(
      "Select whether the suspect is a person or a company",
    );
    await this.page.getByTestId("add-suspect-radio-link").click();
    await expect(this.page.getByTestId("add-suspect-radio-yes")).toBeFocused();
    this.addPersonSuspect();
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-last-name-text-link"),
    ).toHaveText("Enter the last name");
    await this.page.getByTestId("suspect-last-name-text-link").click();
    await expect(this.page.getByTestId("suspect-last-name-text")).toBeFocused();
  }

  async addPersonSuspect() {
    await this.page.getByRole("radio", { name: "Person" }).check();
  }
  async addCompanySuspect() {
    await this.page.getByRole("radio", { name: "Company" }).check();
  }
  async addSuspectFirstName(name: string) {
    await this.page.getByLabel("First name").fill(name);
  }

  async addSuspectLastName(name: string) {
    await this.page.getByLabel("Last name").fill(name);
  }

  async addSuspectCompanyName(name: string) {
    await this.page.getByLabel("Company name").fill(name);
  }

  async selectAdditionalDetailsDOB() {
    await this.page.getByLabel("Date of birth").check();
  }

  async selectAdditionalDetailsGender() {
    await this.page.getByLabel("Gender").check();
  }
  async selectAdditionalDetailsDisability() {
    await this.page.getByLabel("Disability").check();
  }
  async selectAdditionalDetailsReligion() {
    await this.page.getByLabel("Religion").check();
  }

  async selectAdditionalDetailsEthnicity() {
    await this.page.getByLabel("Ethnicity").check();
  }

  async selectAdditionalDetailsAlias() {
    await this.page.getByLabel("Alias details").check();
  }

  async selectAdditionalDetailsASN() {
    await this.page.getByLabel("Arrest Summons Number (ASN)").check();
  }

  async selectAdditionalDetailsOffenderType() {
    await this.page.getByLabel("Type of offender").check();
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
