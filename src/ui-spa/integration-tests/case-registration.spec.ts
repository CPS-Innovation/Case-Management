import { expect, test } from "./utils/test";

test.describe("Login functionality", () => {
  test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await expect(page).toHaveTitle(/Case Management/);
  });
});
