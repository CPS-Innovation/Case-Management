import { expect, test } from "./utils/test";

test.describe("Case Registration", () => {
  test("Should successfully complete non suspect journey", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await expect(page).toHaveURL("http://localhost:5173/case-registration");
    await expect(page).toHaveTitle(/Case Management Register a Case/);
    await expect(page.locator("h1")).toHaveText("Register a case");
    await expect(page.locator("legend").first()).toHaveText(
      "Do you have an operation name?",
    );
    await expect(page.locator("legend").nth(1)).toHaveText(
      "Do you have any suspect details?",
    );
    await expect(
      page.getByTestId("case-registration-error-summary"),
    ).not.toBeVisible();
    //save and continue without selecting any options
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      page.getByTestId("case-registration-error-summary"),
    ).toBeVisible();
    await expect(page.getByTestId("operation-name-radio-link")).toBeVisible();
    await expect(page.getByTestId("operation-name-radio-link")).toHaveText(
      "Select if you have an operation name",
    );
    await expect(page.getByTestId("suspect-details-radio-link")).toBeVisible();
    await expect(page.getByTestId("suspect-details-radio-link")).toHaveText(
      "Select if you have suspect details",
    );
    await page.getByTestId("operation-name-radio-link").click();
    await expect(page.getByTestId("operation-name-radio-yes")).toBeFocused();
    await page.getByTestId("suspect-details-radio-link").click();
    await expect(page.getByTestId("suspect-details-radio-yes")).toBeFocused();
    //save and continue without selecting operation name yes and not selecting suspect details
    await page.getByTestId("operation-name-radio-yes").click();
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      page.getByTestId("case-registration-error-summary"),
    ).toBeVisible();
    await expect(
      page.getByTestId("operation-name-radio-link"),
    ).not.toBeVisible();
    await expect(page.getByTestId("operation-name-text-link")).toBeVisible();
    await expect(page.getByTestId("operation-name-text-link")).toHaveText(
      "You need to enter an operation name",
    );
    await expect(page.getByTestId("suspect-details-radio-link")).toBeVisible();
    await expect(page.getByTestId("suspect-details-radio-link")).toHaveText(
      "Select if you have suspect details",
    );
    await page.getByTestId("operation-name-text-link").click();
    await expect(page.getByTestId("operation-name-text")).toBeFocused();
    //save and continue without selecting operation name no and suspect details no
    await page.getByTestId("operation-name-radio-no").click();
    await page.getByTestId("suspect-details-radio-no").click();
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      page.getByTestId("case-registration-error-summary"),
    ).toBeVisible();
    await expect(page.getByTestId("operation-name-radio-link")).toBeVisible();
    await expect(page.getByTestId("operation-name-radio-link")).toHaveText(
      "Select if you have an operation name",
    );
    await expect(page.getByTestId("suspect-details-radio-link")).toBeVisible();
    await expect(page.getByTestId("suspect-details-radio-link")).toHaveText(
      "Select if you have suspect details",
    );
    //save and continue after adding operation name and suspect details no
    await page.getByTestId("operation-name-radio-yes").click();
    await page.getByTestId("operation-name-text").fill("thunderstruck");
    await page.getByTestId("suspect-details-radio-no").click();
    await page.getByRole("button", { name: "Save and continue" }).click();

    //case areas page
    await expect(page).toHaveURL(
      "http://localhost:5173/case-registration/areas",
    );
    await expect(page.locator("label").first()).toHaveText(
      "What is the division or area?",
    );
    await expect(page.locator("#area-or-division-text")).toHaveValue(
      "CAMBRIDGESHIRE",
    );
    await page.locator("#area-or-division-text").fill("");
    await page.getByRole("button", { name: "Save and continue" }).click();

    await expect(page.getByTestId("case-area-error-summary")).toBeVisible();
    await expect(page.getByTestId("area-or-division-text-link")).toBeVisible();
    await expect(page.getByTestId("area-or-division-text-link")).toHaveText(
      "Select a division or area",
    );
    await page.locator("#area-or-division-text").fill("abc");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByTestId("case-area-error-summary")).toBeVisible();
    await expect(page.getByTestId("area-or-division-text-link")).toBeVisible();
    await expect(page.getByTestId("area-or-division-text-link")).toHaveText(
      "Select a valid case area",
    );
    await page.locator("#area-or-division-text").fill("CAMBRIDGESHIRE");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByTestId("case-area-error-summary")).not.toBeVisible();

    //case areas page
    await expect(page).toHaveURL(
      "http://localhost:5173/case-registration/case-details",
    );
    await expect(page.locator("h1")).toHaveText("Case details");
    await expect(page.locator("legend").first()).toHaveText("What is the URN?");
    await expect(page.locator("label").nth(0)).toHaveText("Police force");
    await expect(page.locator("label").nth(1)).toHaveText("Police unit");
    await expect(page.locator("label").nth(2)).toHaveText("Unique reference");
    await expect(page.locator("label").nth(3)).toHaveText("Year reference");
    await expect(page.locator("label").nth(4)).toHaveText(
      "What is the registering unit?",
    );
    await expect(page.locator("label").nth(5)).toHaveText(
      "What is the witness care unit (WCU)?",
    );
    await expect(page.getByTestId("urn-year-reference-text")).toHaveValue("26");
    await page.getByTestId("urn-year-reference-text").fill("");
    await expect(
      page.getByTestId("case-details-error-summary"),
    ).not.toBeVisible();

    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(page.getByTestId("case-details-error-summary")).toBeVisible();
    await expect(page.getByTestId("urn-error-text-link")).toBeVisible();
    await expect(page.getByTestId("urn-error-text-link")).toHaveText(
      "Enter the URN",
    );
    await expect(
      page.getByTestId("registering-unit-error-text-link"),
    ).toBeVisible();
    await expect(
      page.getByTestId("registering-unit-error-text-link"),
    ).toHaveText("Select the registering unit");
    await expect(
      page.getByTestId("witness-care-unit-error-text-link"),
    ).toBeVisible();
    await expect(
      page.getByTestId("witness-care-unit-error-text-link"),
    ).toHaveText("Select the witness care unit");

    await page.getByTestId("urn-error-text-link").click();
    await expect(page.getByTestId("urn-police-force-text")).toBeFocused();
    await page.getByTestId("urn-police-force-text").fill("12");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await page.getByTestId("urn-error-text-link").click();
    await expect(page.getByTestId("urn-police-unit-text")).toBeFocused();
    await page.getByTestId("urn-police-unit-text").fill("21");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await page.getByTestId("urn-error-text-link").click();
    await expect(page.getByTestId("urn-unique-reference-text")).toBeFocused();
    await page.getByTestId("urn-unique-reference-text").fill("12345");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await page.getByTestId("urn-error-text-link").click();
    await expect(page.getByTestId("urn-year-reference-text")).toBeFocused();
    await page.getByTestId("urn-year-reference-text").fill("26");
    await page.getByRole("button", { name: "Save and continue" }).click();

    await page.getByTestId("registering-unit-error-text-link").click();
    await expect(page.locator("#registering-unit-text")).toBeFocused();
    await page.locator("#registering-unit-text").fill("abc");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      page.getByTestId("registering-unit-error-text-link"),
    ).toHaveText("Select a valid registering unit");
    await page.getByTestId("registering-unit-error-text-link").click();
    await expect(page.locator("#registering-unit-text")).toBeFocused();
    await page
      .locator("#registering-unit-text")
      .fill("NORTHERN CJU (Peterborough)");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Save and continue" }).click();

    await page.getByTestId("witness-care-unit-error-text-link").click();
    await expect(page.locator("#witness-care-unit-text")).toBeFocused();
    await page.locator("#witness-care-unit-text").fill("abc");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      page.getByTestId("witness-care-unit-error-text-link"),
    ).toHaveText("Select a valid witness care unit");
    await page.getByTestId("witness-care-unit-error-text-link").click();
    await expect(page.locator("#witness-care-unit-text")).toBeFocused();
    await page
      .locator("#witness-care-unit-text")
      .fill("Cambridgeshire Non Operational WCU");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      page.getByTestId("case-details-error-summary"),
    ).not.toBeVisible();

    await expect(page).toHaveURL(
      "http://localhost:5173/case-registration/case-monitoring-codes",
    );

    await expect(page.locator("h1")).toHaveText("Add monitoring codes");
  });
});
