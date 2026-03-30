import { Page, expect } from "@playwright/test";

export class AddChargeVictimPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements(name: string, charge: string) {
    await expect(this.page.locator("h1")).toHaveText(
      "Add a victim to this charge",
    );
    await expect(this.page.locator("h2").nth(0)).toHaveText(name);
    await expect(this.page.locator("h2").nth(1)).toHaveText(charge);
    await expect(
      this.page.getByLabel("Victim first name (optional)"),
    ).toBeVisible();
    await expect(this.page.getByLabel("Victim last name")).toBeVisible();
    await expect(this.page.locator("fieldset legend")).toHaveText(
      "Victim details (optional)",
    );
    await expect(
      this.page.getByLabel("The victim is vulnerable"),
    ).toBeVisible();
    await expect(
      this.page.getByLabel("The victim has been intimidated"),
    ).toBeVisible();
    await expect(this.page.getByLabel("The victim is a witness")).toBeVisible();
    await expect(this.page.getByLabel("The victim is a witness")).toBeChecked();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-charge-victim-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("victim-lastname-link")).toHaveText(
      "Enter the victim's last name",
    );
    await this.page.getByTestId("victim-lastname-link").click();
    await expect(this.page.locator("#victim-lastname-text")).toBeFocused();

    await this.saveAndContinue();
  }

  async fillVictimFirstName(name: string) {
    await this.page.locator("#victim-firstname-text").fill(name);
  }
  async fillVictimLastName(name: string) {
    await this.page.locator("#victim-lastname-text").fill(name);
  }

  async selectVictimIsVulnerable(checked: boolean) {
    if (checked) {
      await this.page.getByLabel("The victim is vulnerable").check();
      return;
    }
    await this.page.getByLabel("The victim is vulnerable").uncheck();
  }

  async selectVictimIsIntimidated(checked: boolean) {
    if (checked) {
      await this.page.getByLabel("The victim has been intimidated").check();
      return;
    }
    await this.page.getByLabel("The victim has been intimidated").uncheck();
  }

  async selectVictimIsWitness(checked: boolean) {
    if (checked) {
      await this.page.getByLabel("The victim is a witness").check();
      return;
    }
    await this.page.getByLabel("The victim is a witness").uncheck();
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
