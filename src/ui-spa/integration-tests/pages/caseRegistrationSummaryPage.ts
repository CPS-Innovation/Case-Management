import { Page, expect } from "@playwright/test";

export class CaseRegistrationSummaryPage {
  private readonly route =
    "http://localhost:5173/case-registration/case-summary";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyBackLink(url) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Check your answers before creating the case",
    );
    await this.verifyNoSuspectElements();
  }

  async verifyCaseDetailsElements(values: {
    area: string;
    urn: string;
    registeringUnit: string;
    wcu: string;
    operationName: string;
  }) {
    const caseDetailWrapperElement = this.page.getByTestId(
      "case-details-summary",
    );
    await expect(caseDetailWrapperElement.locator("h2").nth(0)).toHaveText(
      "Case details",
    );
    const caseDetailsDescriptionList = caseDetailWrapperElement
      .locator("dl")
      .nth(0);
    const rows = caseDetailsDescriptionList.locator(".govuk-summary-list__row");
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText("Area");
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(values.area);
    const areaChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(areaChangeLink).toHaveAttribute(
      "href",
      "/case-registration/areas",
    );

    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText("URN");
    await expect(rows.nth(1).locator("dd").nth(0)).toHaveText("122112345/26");
    const urnChangeLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(urnChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-details",
    );

    await expect(rows.nth(2).locator("dt").nth(0)).toHaveText(
      "Registering unit",
    );
    await expect(rows.nth(2).locator("dd").nth(0)).toHaveText(
      "NORTHERN CJU (Peterborough)",
    );
    const registeringUnitChangeLink = rows
      .nth(2)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(registeringUnitChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-details",
    );

    await expect(rows.nth(3).locator("dt").nth(0)).toHaveText("WCU");
    await expect(rows.nth(3).locator("dd").nth(0)).toHaveText(
      "Cambridgeshire Non Operational WCU",
    );
    const wcuChangeLink = rows
      .nth(3)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(wcuChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-details",
    );

    await expect(rows.nth(4).locator("dt").nth(0)).toHaveText("Operation name");
    await expect(rows.nth(4).locator("dd").nth(0)).toHaveText("thunderstruck");
    const operationNameChangeLink = rows
      .nth(4)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(operationNameChangeLink).toHaveAttribute(
      "href",
      "/case-registration",
    );
  }

  async verifyNoSuspectElements() {
    const caseSuspectWrapperElement = this.page.getByTestId(
      "case-suspect-summary",
    );
    await expect(caseSuspectWrapperElement.locator("h2")).toHaveText("Suspect");
    const suspectDetailsDescriptionList =
      caseSuspectWrapperElement.locator("dl");
    const rows = suspectDetailsDescriptionList.locator(
      ".govuk-summary-list__row",
    );
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText("Suspects");
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText("Not entered");
    const areaChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Add a suspect" });
    await expect(areaChangeLink).toHaveAttribute(
      "href",
      "/case-registration/suspect-0/add-suspect",
    );
  }

  async verifyComplexityAndMonitoringCodesElements(values: {
    complexity: string;
    monitoringCodes: string[];
  }) {
    const caseComplexityWrapperElement = this.page.getByTestId(
      "case-complexity-and-monitoring-codes-summary",
    );
    await expect(caseComplexityWrapperElement.locator("h2")).toHaveText(
      "Case complexity and monitoring codes",
    );
    const suspectDetailsDescriptionList =
      caseComplexityWrapperElement.locator("dl");
    const rows = suspectDetailsDescriptionList.locator(
      ".govuk-summary-list__row",
    );
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText(
      "Case complexity",
    );
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(
      values.complexity,
    );
    const complexityChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(complexityChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-complexity",
    );
    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText(
      "Monitoring codes",
    );
    const monitoringCodes = await rows
      .nth(1)
      .locator("dd")
      .nth(0)
      .locator("li")
      .allTextContents();
    expect(monitoringCodes).toEqual(values.monitoringCodes);
    const monitoringCodesChangeLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(monitoringCodesChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-monitoring-codes",
    );
  }

  async verifyWorkingOnTheCaseElements(values: {
    prosecutor: string;
    caseworker: string;
    investigator: string;
    shoulderNumber: string;
    policeUnit: string;
  }) {
    const caseAssigneeWrapperElement = this.page.getByTestId(
      "case-assignee-summary",
    );
    await expect(caseAssigneeWrapperElement.locator("h2")).toHaveText(
      "Working on the case",
    );
    const caseDetailsDescriptionList = caseAssigneeWrapperElement.locator("dl");
    const rows = caseDetailsDescriptionList.locator(".govuk-summary-list__row");
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText("Prosecutor");
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(
      values.prosecutor,
    );
    const prosecutorChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(prosecutorChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );

    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText("Caseworker");
    await expect(rows.nth(1).locator("dd").nth(0)).toHaveText(
      values.caseworker,
    );
    const caseworkerChangeLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(caseworkerChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );

    await expect(rows.nth(2).locator("dt").nth(0)).toHaveText(
      "Police officer or investigator",
    );
    await expect(rows.nth(2).locator("dd").nth(0)).toHaveText(
      values.investigator,
    );
    const investigatorChangeLink = rows
      .nth(2)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(investigatorChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );

    await expect(rows.nth(3).locator("dt").nth(0)).toHaveText(
      "Shoulder number",
    );
    await expect(rows.nth(3).locator("dd").nth(0)).toHaveText(
      values.shoulderNumber,
    );
    const shoulderNumberChangeLink = rows
      .nth(3)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(shoulderNumberChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );

    await expect(rows.nth(4).locator("dt").nth(0)).toHaveText("Police unit");
    await expect(rows.nth(4).locator("dd").nth(0)).toHaveText(
      values.policeUnit,
    );
    const policeUnitChangeLink = rows
      .nth(4)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(policeUnitChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );
  }

  async verifyFirstHearingElements(values: {
    courtLocation: string;
    firstHearingDate: string;
  }) {
    const caseFirstHearingWrapperElement = this.page.getByTestId(
      "case-first-hearing-summary",
    );
    await expect(caseFirstHearingWrapperElement.locator("h2")).toHaveText(
      "First hearing details",
    );
    const suspectDetailsDescriptionList =
      caseFirstHearingWrapperElement.locator("dl");
    const rows = suspectDetailsDescriptionList.locator(
      ".govuk-summary-list__row",
    );
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText(
      "First hearing court location",
    );
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(
      values.courtLocation,
    );
    const courtLocationChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(courtLocationChangeLink).toHaveAttribute(
      "href",
      "/case-registration/first-hearing",
    );
    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText(
      "First hearing date",
    );
    await expect(rows.nth(1).locator("dd").nth(0)).toHaveText(
      values.firstHearingDate,
    );
    const firstHearingDateLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(firstHearingDateLink).toHaveAttribute(
      "href",
      "/case-registration/first-hearing",
    );
  }

  async verifySuspectSummaryDetails(
    suspectIndex: number,
    values: { key: string; value: string | string[] }[],
  ) {
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText("Details and charges");
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("h3")
        .nth(0),
    ).toHaveText("Suspect details");
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
    await Promise.all(
      values.map(async (value, index) => {
        await expect(
          this.page
            .getByTestId(`suspect-details-${suspectIndex}`)
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dt")
            .nth(0),
        ).toHaveText(value.key);
        await expect(
          this.page
            .getByTestId(`suspect-details-${suspectIndex}`)
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dd")
            .nth(0),
        ).toHaveText(value.value);
      }),
    );
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
  }

  async verifyChargesSummaryDetails(
    suspectIndex: number,
    values: { key: string; value: string | string[] }[],
  ) {
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText("Details and charges");
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("h3")
        .nth(1),
    ).toHaveText("Charges");
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
    await Promise.all(
      values.map(async (value, index) => {
        await expect(
          this.page
            .getByTestId(`suspect-details-${suspectIndex}`)
            .getByTestId(`suspect-charges`)
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dt")
            .nth(0),
        ).toHaveText(value.key);
        await expect(
          this.page
            .getByTestId(`suspect-details-${suspectIndex}`)
            .getByTestId(`suspect-charges`)
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dd")
            .nth(0),
        ).toHaveText(value.value);
      }),
    );
  }

  async verifyAddNewChargeDetails(
    suspectIndex: number,
    data: { key: string; action: string; link: string },
  ) {
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText("Details and charges");

    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();

    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .getByTestId(`add-new-charge`)
        .locator(".govuk-summary-list__row")
        .nth(0)
        .locator("dt")
        .nth(0),
    ).toHaveText(data.key);

    const addChargeLink = this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .getByTestId(`add-new-charge`)
      .locator(".govuk-summary-list__row")
      .nth(0)
      .locator("dd")
      .nth(1)
      .locator("a");
    await expect(addChargeLink).toHaveText(data.action);
    await expect(addChargeLink).toHaveAttribute("href", data.link);
  }
  async clickCreateCaseButton() {
    const createCaseButton = this.page.locator("button[type='submit']");
    await expect(createCaseButton).toHaveText("Accept and create");
    // await createCaseButton.click();
  }
}
