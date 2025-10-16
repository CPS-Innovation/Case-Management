import { expect, test } from "./utils/test";

test.describe("Case Registration", () => {
  test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await expect(page).toHaveTitle(/Case Management/);
  });
});
