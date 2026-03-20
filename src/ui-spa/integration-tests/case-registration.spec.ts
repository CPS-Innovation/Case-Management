import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";

test.describe("Case Registration", () => {
  test("Should successfully complete non suspect journey", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await expect(page).toHaveTitle(/Case Management Register a Case/);
    const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
    await caseRegistrationHomePage.verifyUrl();
    await caseRegistrationHomePage.verifyPageElements();
    await caseRegistrationHomePage.errorValidations();
    await caseRegistrationHomePage.addOperationName("thunderstruck");
    await caseRegistrationHomePage.addNoSuspect();
    await caseRegistrationHomePage.saveAndContinue();
    await caseRegistrationHomePage.verifyErrorSummaryClear();

    const caseAreasPage = new CaseAreasPage(page);
    await caseAreasPage.verifyUrl();
    await caseAreasPage.verifyPageElements();
    await caseAreasPage.errorValidations();
    await caseAreasPage.enterAreaOrDivision("CAMBRIDGESHIRE");
    await caseAreasPage.saveAndContinue();
    await caseAreasPage.verifyErrorSummaryClear();

    const caseDetailsPage = new CaseDetailsPage(page);
    await caseDetailsPage.verifyUrl();
    await caseDetailsPage.verifyPageElements();
    await caseDetailsPage.errorValidations();
    await caseDetailsPage.enterUrnPoliceForce("12");
    await caseDetailsPage.enterUrnPoliceUnit("21");
    await caseDetailsPage.enterUrnUniqueReference("12345");
    await caseDetailsPage.enterUrnYearReference("26");
    await caseDetailsPage.enterRegisteringUnit("NORTHERN CJU (Peterborough)");
    await caseDetailsPage.enterWitnessCareUnit(
      "Cambridgeshire Non Operational WCU",
    );
    await caseDetailsPage.saveAndContinue();
    await caseDetailsPage.verifyErrorSummaryClear();

    await expect(page).toHaveURL(
      "http://localhost:5173/case-registration/case-monitoring-codes",
    );

    await expect(page.locator("h1")).toHaveText("Add monitoring codes");
  });
});
