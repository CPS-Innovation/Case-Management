import { getCaseRegistrationRequestData } from "./getCaseRegistrationRequestData";
import { type CaseRegistrationFormData } from "../reducers/caseRegistrationReducer";
import { type CaseMonitoringCode } from "../types/responses/CaseMonitoringCodes";
describe("getCaseRegistrationRequestData", () => {
  it("returns correct CaseRegistration request data", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "no",
      operationNameText: "Operation Name",
      areaOrDivisionText: { id: 1, description: "Area 1" },
      urnPoliceForceText: "PF001",
      urnPoliceUnitText: "PU001",
      urnUniqueReferenceText: "URN001",
      urnYearReferenceText: "21",
      registeringUnitText: { id: 1, description: "Registering Unit 1" },
      witnessCareUnitText: { id: 1, description: "Witness Care Unit 1" },
      firstHearingRadio: "yes",
      firstHearingCourtLocationText: { id: 1, description: "Court Location 1" },
      firstHearingDateText: "2021-11-26",
      caseComplexityRadio: { shortCode: "HIGH", description: "High" },
      caseMonitoringCodesCheckboxes: ["MC001", "MC002"],
      caseProsecutorRadio: "yes",
      caseInvestigatorRadio: "yes",
      caseProsecutorText: { id: 1, description: "Prosecutor 1" },
      caseCaseworkerText: { id: 1, description: "Caseworker 1" },
      caseInvestigatorTitleSelect: {
        shortCode: "INV001",
        display: "Investigator 1",
      },
      caseInvestigatorFirstNameText: "Investigator",
      caseInvestigatorLastNameText: "One",
      caseInvestigatorShoulderNameText: "Shoulder Name",
      caseInvestigatorShoulderNumberText: "Shoulder Number",

      suspects: [],
      victimsList: [],
      wantToAddChargesRadio: "",
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
      },
    };
    const monitoringCodesData: CaseMonitoringCode[] = [
      {
        code: "MC001",
        description: "Monitoring Code 1",
        display: "Monitoring Code 1",
      },
      {
        code: "MC002",
        description: "Monitoring Code 2",
        display: "Monitoring Code 2",
      },
      {
        code: "MC003",
        description: "Monitoring Code 3",
        display: "Monitoring Code 3",
      },
    ];
    const result = getCaseRegistrationRequestData(
      formData,
      monitoringCodesData,
    );
    expect(result).toEqual({
      allocateWcuId: 1,
      caseWorker: "1",
      courtLocationId: 1,
      courtLocationName: "Court Location 1",
      hearingDate: "2021-11-26",
      monitoringCodes: [
        {
          code: "MC001",
          selected: true,
        },
        {
          code: "MC002",
          selected: true,
        },
      ],
      complexity: "HIGH",
      ociFirstName: "Investigator",
      ociPoliceUnit: "",
      ociRank: "INV001",
      ociShoulderNumber: "Shoulder Number",
      ociSurname: "One",
      operationName: "Operation Name",
      prosecutorId: 1,
      registeringAreaId: 1,
      registeringUnitId: 1,
      urn: {
        policeForce: "PF001",
        policeUnit: "PU001",
        uniqueRef: "URN001",
        year: 21,
      },
    });
  });

  it("Should return the correct default values if some of the values are not present", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "operationName",
      suspectDetailsRadio: "suspectDetails",
      operationNameText: "Operation Name",
      areaOrDivisionText: { id: 1, description: "Area 1" },
      urnPoliceForceText: "PF001",
      urnPoliceUnitText: "PU001",
      urnUniqueReferenceText: "URN001",
      urnYearReferenceText: "21",
      registeringUnitText: { id: 1, description: "Registering Unit 1" },
      witnessCareUnitText: { id: null, description: "" },
      firstHearingRadio: "no",
      firstHearingCourtLocationText: { id: null, description: "" },
      firstHearingDateText: "",
      caseComplexityRadio: { shortCode: "HIGH", description: "High" },
      caseMonitoringCodesCheckboxes: ["MC001", "MC002"],
      caseProsecutorRadio: "no",
      caseInvestigatorRadio: "no",
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
      caseInvestigatorTitleSelect: {
        shortCode: null,
        display: "",
      },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
      suspects: [],
      victimsList: [],
      wantToAddChargesRadio: "",
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
      },
    };
    const monitoringCodesData: CaseMonitoringCode[] = [
      {
        code: "MC001",
        description: "Monitoring Code 1",
        display: "Monitoring Code 1",
      },
      {
        code: "MC002",
        description: "Monitoring Code 2",
        display: "Monitoring Code 2",
      },
      {
        code: "MC003",
        description: "Monitoring Code 3",
        display: "Monitoring Code 3",
      },
    ];
    const result = getCaseRegistrationRequestData(
      formData,
      monitoringCodesData,
      {
        unitId: 2091,
        unitDescription: "Plymouth Magistrates Court Unit",
        code: "AC",
        description: "CJU - Cornwall",
      },
    );
    expect(result).toEqual({
      allocateWcuId: 0,
      caseWorker: "",
      courtLocationId: 0,
      courtLocationName: "",
      hearingDate: null,
      monitoringCodes: [
        {
          code: "MC001",
          selected: true,
        },
        {
          code: "MC002",
          selected: true,
        },
      ],
      complexity: "HIGH",
      ociFirstName: "",
      ociPoliceUnit: "AC",
      ociRank: "",
      ociShoulderNumber: "",
      ociSurname: "",
      operationName: "Operation Name",
      prosecutorId: 0,
      registeringAreaId: 1,
      registeringUnitId: 1,
      urn: {
        policeForce: "PF001",
        policeUnit: "PU001",
        uniqueRef: "URN001",
        year: 21,
      },
    });
  });
});
