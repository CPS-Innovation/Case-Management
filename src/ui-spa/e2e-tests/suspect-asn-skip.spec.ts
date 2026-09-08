import { expect, test } from "@playwright/test";
import { AddSuspectPage } from "../integration-tests/pages/addSuspectPage";
import { SuspectASNPage } from "../integration-tests/pages/suspectASNPage";
import { SuspectSummaryPage } from "../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../integration-tests/pages/wantToAddChargesPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import { startAtHomePage, enterAreasAndCaseDetails } from "./journeys/steps";
import { completeAssigneeAndSubmit } from "./journeys/steps";
import { personName } from "./journeys/suspectChargeSteps";

const SUSPECT_BASE = "/case-registration/suspect-0";

interface CaseRegistrationPayload {
  defendants?: { arrestSummonsNumber?: string | null }[];
}

test("Scenario 13: arrest summons number can be skipped, and none is recorded for the suspect", async ({
  page,
}) => {
  const urn = generateUniqueUrn();
  const name = personName();

  let payload: CaseRegistrationPayload | null = null;
  page.on("request", (request) => {
    if (
      request.url().endsWith("/api/v1/cases") &&
      request.method() === "POST"
    ) {
      payload = JSON.parse(
        request.postData() ?? "null",
      ) as CaseRegistrationPayload;
    }
  });

  await startAtHomePage(page, { hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const addSuspectPage = new AddSuspectPage(page);
  await expectStep(page, `${SUSPECT_BASE}/add-suspect`);
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName(name.first);
  await addSuspectPage.addSuspectLastName(name.last);
  await addSuspectPage.selectAdditionalDetailsASN(true);
  await addSuspectPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await expectStep(page, `${SUSPECT_BASE}/suspect-asn`);

  await suspectASNPage.saveAndContinue();

  const errorSummary = page.getByTestId("suspect-asn-error-summary");
  await expect(errorSummary).toBeVisible();
  await expect(
    errorSummary.getByRole("heading", { name: "There is a problem" }),
  ).toBeVisible();

  const enterAsnLink = page.getByTestId("suspect-asn-text-link");
  const skipLink = page.getByTestId("suspect-detail-skip-link");
  await expect(enterAsnLink).toHaveText(
    "Enter the Arrest Summons Number (ASN)",
  );
  await expect(skipLink).toHaveText("I do not have the Arrest Summons Number");

  await enterAsnLink.click();
  await expect(page.locator("#suspect-asn-text")).toBeFocused();
  await expectStep(page, `${SUSPECT_BASE}/suspect-asn`);

  await skipLink.click();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

  await completeAssigneeAndSubmit(page, urn);

  expect(payload, "no POST /api/v1/cases payload was captured").not.toBeNull();
  const defendants = payload!.defendants ?? [];
  expect(defendants, "expected exactly one defendant").toHaveLength(1);
  expect(
    defendants[0].arrestSummonsNumber,
    "skipping the ASN must submit no arrest summons number",
  ).toBeFalsy();
});
