import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { AddSuspectPage } from "./pages/addSuspectPage";
import { SuspectDOBPage } from "./pages/suspectDOBPage";
import { SuspectGenderPage } from "./pages/suspectGenderPage";
import { SuspectDisabilityPage } from "./pages/suspectDisabilityPage";
import { SuspectReligionPage } from "./pages/suspectReligionPage";
import { SuspectEthnicityPage } from "./pages/suspectEthnicityPage";
import { SuspectASNPage } from "./pages/suspectASNPage";
import { SuspectOffenderTypesPage } from "./pages/suspectOffenderTypesPage";
import { version } from "react";

test.describe("Suspect journey", () => {
  test("Should successfully complete suspect journey", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await expect(page).toHaveTitle(/Case Management Register a Case/);
    const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
    await caseRegistrationHomePage.verifyUrl();
    await caseRegistrationHomePage.verifyPageElements();
    await caseRegistrationHomePage.errorValidations();
    await caseRegistrationHomePage.addOperationName("thunderstruck");
    await caseRegistrationHomePage.addSuspect();
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

    const addSuspectPage = new AddSuspectPage(page);
    await addSuspectPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/add-suspect",
    );
    await addSuspectPage.verifyBasePageElements();
    await addSuspectPage.addPersonSuspect();
    await addSuspectPage.verifyAdditionalElements();
    await addSuspectPage.addPersonSuspect();
    await addSuspectPage.addSuspectFirstName("harry");
    await addSuspectPage.addSuspectLastName("potter");
    await addSuspectPage.selectAdditionalDetailsDOB();
    await addSuspectPage.selectAdditionalDetailsGender();
    await addSuspectPage.selectAdditionalDetailsDisability();
    await addSuspectPage.selectAdditionalDetailsReligion();
    await addSuspectPage.selectAdditionalDetailsEthnicity();
    await addSuspectPage.selectAdditionalDetailsASN();
    // await addSuspectPage.selectAdditionalDetailsAlias();
    await addSuspectPage.selectAdditionalDetailsOffenderType();
    await addSuspectPage.saveAndContinue();

    const suspectDOBPage = new SuspectDOBPage(page);
    await suspectDOBPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-dob",
    );
    await suspectDOBPage.verifyPageElements();
    await suspectDOBPage.errorValidations();
    await suspectDOBPage.addDOBDay("27");
    await suspectDOBPage.addDOBMonth("03");
    await suspectDOBPage.addDOBYear("2007");
    await suspectDOBPage.saveAndContinue();

    const suspectGenderPage = new SuspectGenderPage(page);
    await suspectGenderPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-gender",
    );
    await suspectGenderPage.verifyPageElements();
    await suspectGenderPage.errorValidations();
    await suspectGenderPage.selectGenderMale();
    await suspectGenderPage.saveAndContinue();

    const suspectDisabilityPage = new SuspectDisabilityPage(page);
    await suspectDisabilityPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-disability",
    );
    await suspectDisabilityPage.verifyPageElements();
    await suspectDisabilityPage.errorValidations();
    await suspectDisabilityPage.selectDisabilityYes();
    await suspectDisabilityPage.saveAndContinue();

    const suspectReligionPage = new SuspectReligionPage(page);
    await suspectReligionPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-religion",
    );
    await suspectReligionPage.verifyPageElements();
    await suspectReligionPage.errorValidations();
    await suspectReligionPage.selectReligionChristianity();
    await suspectReligionPage.saveAndContinue();

    const suspectEthnicityPage = new SuspectEthnicityPage(page);
    await suspectEthnicityPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
    );
    await suspectEthnicityPage.verifyPageElements();
    await suspectEthnicityPage.errorValidations();
    await suspectEthnicityPage.selectEthnicityBlack();
    await suspectEthnicityPage.saveAndContinue();

    const suspectASNPage = new SuspectASNPage(page);
    await suspectASNPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-asn",
    );
    await suspectASNPage.verifyPageElements();
    await suspectASNPage.errorValidations();
    await suspectASNPage.addASNText("123456");
    await suspectASNPage.saveAndContinue();

    const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
    await suspectOffenderTypesPage.verifyUrl(
      "http://localhost:5173/case-registration/suspect-0/suspect-offender",
    );
    await suspectOffenderTypesPage.verifyBasePageElements();
    await suspectOffenderTypesPage.errorValidations();
    await suspectOffenderTypesPage.verifyPYOElements();
    await suspectOffenderTypesPage.verifyYOElements();
    await suspectOffenderTypesPage.selectOffenderTypePYO();
    await suspectOffenderTypesPage.addArrestDate("2024-01-01");
    await suspectOffenderTypesPage.saveAndContinue();
  });
});
