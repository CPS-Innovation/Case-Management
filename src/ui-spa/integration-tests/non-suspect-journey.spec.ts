import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";

test.describe("Non suspect journey", () => {
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
    await caseAreasPage.verifyBackLink("/case-registration");
    await caseAreasPage.backLinkClick();
    await caseRegistrationHomePage.verifyUrl();
    await caseRegistrationHomePage.saveAndContinue();
    await caseAreasPage.verifyUrl();
    await caseAreasPage.verifyPageElements();
    await caseAreasPage.errorValidations();
    await caseAreasPage.enterAreaOrDivision("CAMBRIDGESHIRE");
    await caseAreasPage.saveAndContinue();
    await caseAreasPage.verifyErrorSummaryClear();

    const caseDetailsPage = new CaseDetailsPage(page);
    await caseDetailsPage.verifyUrl();
    await caseDetailsPage.verifyBackLink("/case-registration/areas");
    await caseDetailsPage.backLinkClick();
    await caseAreasPage.verifyUrl();
    await caseAreasPage.saveAndContinue();
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

    const caseMonitoringPage = new CaseMonitoringPage(page);
    await caseMonitoringPage.verifyUrl();
    await caseMonitoringPage.verifyBackLink("/case-registration/case-details");
    await caseMonitoringPage.backLinkClick();
    await caseDetailsPage.verifyUrl();
    await caseDetailsPage.saveAndContinue();
    await caseMonitoringPage.verifyUrl();
    await caseMonitoringPage.verifyPageElements(45);
    await caseMonitoringPage.verifyPreChargeCheckboxChecked();
    await caseMonitoringPage.selectMonitoringCode("Asset Recovery");
    await caseMonitoringPage.saveAndContinue();
    await caseMonitoringPage.verifyErrorSummaryClear();

    const caseAssigneePage = new CaseAssigneePage(page);
    await caseAssigneePage.verifyUrl();
    await caseAssigneePage.verifyBackLink(
      "/case-registration/case-monitoring-codes",
    );
    await caseAssigneePage.backLinkClick();
    await caseMonitoringPage.verifyUrl();
    await caseMonitoringPage.saveAndContinue();
    await caseAssigneePage.verifyUrl();
    await caseAssigneePage.verifyPageElements();
    await caseAssigneePage.errorValidations();
    await caseAssigneePage.addProsecutorYes();
    await caseAssigneePage.addInvestigatorYes();
    await caseAssigneePage.enterProsecutorName("Prosecutor A");
    await caseAssigneePage.enterCaseworkerName("Caseworker A");
    // await caseAssigneePage.addInvestigatorTitle("Police Constable");
    await caseAssigneePage.addInvestigatorFirstName("Investigator F");
    await caseAssigneePage.addInvestigatorLastName("Investigator L");
    await caseAssigneePage.addInvestigatorShoulderNumber("12345");
    await caseAssigneePage.saveAndContinue();
    await expect(page).toHaveURL(
      "http://localhost:5173/case-registration/case-summary",
    );

    const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
    await caseRegistrationSummaryPage.verifyUrl();
    await caseRegistrationSummaryPage.verifyBackLink(
      "/case-registration/case-assignee",
    );
    await caseRegistrationSummaryPage.backLinkClick();
    await caseAssigneePage.verifyUrl();
    await caseAssigneePage.saveAndContinue();
    await caseRegistrationSummaryPage.verifyUrl();
    await caseRegistrationSummaryPage.verifyPageElements();
    await caseRegistrationSummaryPage.verifyCaseDetailsElements({
      area: "CAMBRIDGESHIRE",
      urn: "122112345/26",
      registeringUnit: "NORTHERN CJU (Peterborough)",
      wcu: "Cambridgeshire Non Operational WCU",
      operationName: "thunderstruck",
    });
    await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements(
      {
        complexity: "Basic",
        monitoringCodes: ["Asset Recovery", "Pre-Charge Decision"],
      },
    );
    await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
      prosecutor: "Prosecutor A",
      caseworker: "Caseworker A",
      investigator: "InvestigatorL, InvestigatorF",
      shoulderNumber: "12345",
      policeUnit: "Not entered",
    });
    await caseRegistrationSummaryPage.clickCreateCaseButton();
  });
});
