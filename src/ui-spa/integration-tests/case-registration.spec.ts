import { expect, test } from "./utils/test";

test.describe("Case Registration", () => {
  test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await expect(page).toHaveTitle(/Case Management/);
    //register a case page
    await expect(
      page.getByRole("heading", { name: "Register a case", level: 1 }),
    ).toBeVisible();

    const fieldset1 = page.locator("fieldset").nth(0);
    await expect(
      fieldset1.getByText(/Do you have an operation name\?/i),
    ).toBeVisible();

    fieldset1.getByRole("radio", { name: /Yes/i });
    fieldset1.getByRole("radio", { name: /No/i });

    const fieldset2 = page.locator("fieldset").nth(1);
    await expect(
      fieldset2.getByText(/Do you have any suspect details\?/i),
    ).toBeVisible();

    fieldset2.getByRole("radio", { name: /Yes/i });
    fieldset2.getByRole("radio", { name: /No/i });

    await page.getByRole("button", { name: /Save and Continue/i }).isVisible();
    await page.getByRole("button", { name: /Save and Continue/i }).click();
    await expect(page.getByTestId("error-summary-wrapper")).toBeFocused();
    const registerACaseErrorSummary = page.getByTestId(
      "case-registration-error-summary",
    );

    await registerACaseErrorSummary
      .getByRole("heading", { name: "There is a problem", level: 2 })
      .isVisible();
    await expect(
      registerACaseErrorSummary
        .getByTestId("operation-name-radio-link")
        .getByText("Please select an option for operation name"),
    ).toBeVisible();

    await expect(
      registerACaseErrorSummary
        .getByTestId("suspect-details-radio-link")
        .getByText("Please select an option for suspect details"),
    ).toBeVisible();

    await registerACaseErrorSummary
      .getByTestId("operation-name-radio-link")
      .click();
    await expect(page.getByTestId("operation-name-radio-yes")).toBeFocused();

    await registerACaseErrorSummary
      .getByTestId("suspect-details-radio-link")
      .click();
    await expect(page.getByTestId("suspect-details-radio-yes")).toBeFocused();

    await page.getByTestId("operation-name-radio-no").click();
    await page.getByTestId("suspect-details-radio-no").click();
    await page.getByRole("button", { name: /Save and Continue/i }).click();
    await registerACaseErrorSummary
      .getByRole("heading", { name: "There is a problem", level: 2 })
      .isVisible();
    await expect(
      registerACaseErrorSummary.getByTestId("operation-name-radio-link"),
    ).not.toBeVisible();
    await expect(
      registerACaseErrorSummary.getByTestId("suspect-details-radio-link"),
    ).not.toBeVisible();
    await expect(
      registerACaseErrorSummary.getByText(
        "Add an operation name or suspect details",
      ),
    ).toBeVisible();

    await page.getByTestId("operation-name-radio-yes").click();
    await page.getByRole("button", { name: /Save and Continue/i }).click();
    await registerACaseErrorSummary
      .getByRole("heading", { name: "There is a problem", level: 2 })
      .isVisible();
    await expect(
      registerACaseErrorSummary.getByText(
        "Add an operation name or suspect details",
      ),
    ).not.toBeVisible();
    await expect(
      registerACaseErrorSummary
        .getByTestId("operation-name-text-link")
        .getByText("Operation name should not be empty"),
    ).toBeVisible();

    await page.getByTestId("operation-name-text").fill("Operation ABC");
    await page.getByRole("button", { name: /Save and Continue/i }).click();
    await expect(registerACaseErrorSummary).not.toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "What is the division or area?",
        level: 1,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Save and Continue/i }).click();

    const caseAreaErrorSummary = await page.getByTestId(
      "case-area-error-summary",
    );
    await expect(
      caseAreaErrorSummary.getByRole("heading", {
        name: "There is a problem",
        level: 2,
      }),
    ).toBeVisible();

    await expect(page.getByTestId("error-summary-wrapper")).toBeFocused();
    await expect(
      caseAreaErrorSummary.getByText(
        "Add an operation name or suspect details",
      ),
    ).not.toBeVisible();
    await expect(
      caseAreaErrorSummary
        .getByTestId("area-or-division-text-link")
        .getByText("Case area should not be empty"),
    ).toBeVisible();
    await caseAreaErrorSummary
      .getByTestId("area-or-division-text-link")
      .click();
    await expect(page.locator("[id=area-or-division-text]")).toBeFocused();
    await page.locator("[id=area-or-division-text]").fill("s");
    const ul = page.locator("[id=area-or-division-text__listbox]");
    await expect(ul.locator("li")).toHaveCount(2);
    await expect(ul.locator("li").nth(0)).toHaveText("Suffolk");
    await expect(ul.locator("li").nth(1)).toHaveText("Surrey");
    await ul.locator("li").nth(1).click();
    await expect(page.locator("[id=area-or-division-text]")).toHaveValue(
      "Surrey",
    );
    await page.getByRole("button", { name: /Save and Continue/i }).click();
    await expect(caseAreaErrorSummary).not.toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Case Details",
        level: 1,
      }),
    ).toBeVisible();
  });
});
