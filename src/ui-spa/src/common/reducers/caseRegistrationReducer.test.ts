import {
  caseRegistrationReducer,
  initialState,
  type CaseRegistrationActions,
  type CaseRegistrationState,
} from "./caseRegistrationReducer";
import { getResetFieldValues } from "./caseRegistrationReducer";

describe("caseRegistrationReducer", () => {
  it("should set formData operationNameRadio using SET_FIELD action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "operationNameRadio", value: "yes" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.operationNameRadio).toBe("yes");
    expect(state.formData.suspectDetailsRadio).toBe("");
    expect(state.formData.operationNameText).toBe("");
  });

  it("should set formData suspectDetailsRadio data using SET_FIELD action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "suspectDetailsRadio", value: "Area 51" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.suspectDetailsRadio).toBe("Area 51");
  });

  it("should set formDataoperationNameText data using SET_FIELD action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "operationNameText", value: "Operation Thunder" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.operationNameText).toBe("Operation Thunder");
  });

  it("should reset the form", () => {
    const apiData = {
      areasAndRegisteringUnits: {
        allUnits: [
          {
            areaId: 1,
            areaDescription: "Area 51",
            areaIsSensitive: false,
            id: 1,
            description: "Area 51",
          },
        ],

        homeUnit: {
          areaId: 1,
          areaDescription: "Area 51",
          areaIsSensitive: false,
          id: 1,
          description: "Area 51",
        },
      },
    };
    const modifiedState: CaseRegistrationState = {
      formData: {
        operationNameRadio: "yes",
        suspectDetailsRadio: "Area 51",
        operationNameText: "Operation Thunder",
        areaOrDivisionText: { id: 1, description: "Division A" },
        urnPoliceForceText: "Force X",
        urnPoliceUnitText: "Unit Y",
        urnUniqueReferenceText: "12345",
        urnYearReferenceText: "24",
        registeringUnitText: { id: 1, description: "Reg Unit 1" },
        witnessCareUnitText: { id: 1, description: "Witness Unit 1" },
        firstHearingRadio: "yes",
        firstHearingCourtLocationText: { id: null, description: "Court A" },
        firstHearingDateText: "2023-01-01",
        caseComplexityRadio: { shortCode: "HIGH", description: "High" },
        caseMonitoringCodesCheckboxes: ["code1", "code2"],
        caseProsecutorRadio: "yes",
        caseInvestigatorRadio: "yes",
        caseProsecutorText: { id: 1, description: "Prosecutor A" },
        caseCaseworkerText: { id: 1, description: "Caseworker A" },
        caseInvestigatorTitleSelect: {
          shortCode: "INV",
          display: "Investigator",
        },
        caseInvestigatorFirstNameText: "abc",
        caseInvestigatorLastNameText: "def",
        caseInvestigatorShoulderNameText: "GHI",
        caseInvestigatorShoulderNumberText: "123",
        caseInvestigatorPoliceUnitText: "Unit Z",
      },
      apiData: apiData,
    };
    const action: CaseRegistrationActions = { type: "RESET_FORM_DATA" };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual({ ...initialState, apiData });
  });

  it("should return current state for unknown action", () => {
    // @ts-expect-error Testing unknown action type
    const state = caseRegistrationReducer(initialState, { type: "UNKNOWN" });
    expect(state).toBe(initialState);
  });

  it("Should set  apisData areasAndRegisteringUnits data using SET_AREAS_AND_REGISTERING_UNITS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_AREAS_AND_REGISTERING_UNITS",
      payload: {
        areasAndRegisteringUnits: {
          allUnits: [
            {
              areaId: 1,
              areaDescription: "Area 51",
              areaIsSensitive: false,
              id: 1,
              description: "Area 51",
            },
          ],

          homeUnit: {
            areaId: 1,
            areaDescription: "Area 51",
            areaIsSensitive: false,
            id: 1,
            description: "Area 51",
          },
        },
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.areasAndRegisteringUnits).toEqual(
      action.payload.areasAndRegisteringUnits,
    );
  });

  it("Should set apiData areasAndWitnessCareUnits data using SET_AREAS_AND_WITNESS_CARE_UNITS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_AREAS_AND_WITNESS_CARE_UNITS",
      payload: {
        areasAndWitnessCareUnits: [
          {
            areaId: 1,
            areaDescription: "Area 51",
            id: 1,
            description: "Area 51",
            isWCU: true,
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.areasAndWitnessCareUnits).toEqual(
      action.payload.areasAndWitnessCareUnits,
    );
  });

  it("Should set apiData courtLocations data using SET_COURT_LOCATIONS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_COURT_LOCATIONS",
      payload: {
        courtLocations: [
          {
            id: 1,
            description: "Court A",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.courtLocations).toEqual(action.payload.courtLocations);
  });
  it("Should set apiData caseComplexities data using SET_CASE_COMPLEXITIES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_COMPLEXITIES",
      payload: {
        caseComplexities: [
          {
            shortCode: "HIGH",
            description: "High",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseComplexities).toEqual(
      action.payload.caseComplexities,
    );
  });
  it("Should set apiData caseMonitoringCodes data using SET_CASE_MONITORING_CODES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_MONITORING_CODES",
      payload: {
        caseMonitoringCodes: [
          {
            code: "Ab",
            description: "abcdef",
            display: "abcdef",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseMonitoringCodes).toEqual(
      action.payload.caseMonitoringCodes,
    );
  });

  it("Should set apiData caseProsecutors data using SET_CASE_PROSECUTORS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_PROSECUTORS",
      payload: {
        caseProsecutors: [
          {
            id: 1,
            description: "Prosecutor A",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseProsecutors).toEqual(
      action.payload.caseProsecutors,
    );
  });

  it("Should set apiData caseCaseworkers data using SET_CASE_CASEWORKERS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_CASEWORKERS",
      payload: {
        caseCaseworkers: [
          {
            id: 1,
            description: "Caseworker A",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseCaseworkers).toEqual(
      action.payload.caseCaseworkers,
    );
  });
  it("Should set apiData caseInvestigatorTitles data using SET_CASE_INVESTIGATOR_TITLES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_INVESTIGATOR_TITLES",
      payload: {
        caseInvestigatorTitles: [
          {
            shortCode: "INVESTIGATOR_A",
            description: "Investigator A",
            display: "Investigator A",
            isPoliceTitle: true,
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseInvestigatorTitles).toEqual(
      action.payload.caseInvestigatorTitles,
    );
  });
});
describe("getResetFieldValues", () => {
  it("should reset caseProsecutorText and caseCaseworkerText when caseProsecutorRadio is 'no'", () => {
    const result = getResetFieldValues("caseProsecutorRadio", "no");
    expect(result).toEqual({
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
    });
  });
  it("should reset caseInvestigator fields when caseInvestigatorRadio is 'no'", () => {
    const result = getResetFieldValues("caseInvestigatorRadio", "no");
    expect(result).toEqual({
      caseInvestigatorTitleSelect: { shortCode: null, display: "" },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
      caseInvestigatorPoliceUnitText: "",
    });
  });
  it("should reset first hearing fields when firstHearingRadio is 'no'", () => {
    const result = getResetFieldValues("firstHearingRadio", "no");
    expect(result).toEqual({
      firstHearingCourtLocationText: { id: null, description: "" },
      firstHearingDateText: "",
    });
  });

  it("should return an empty object for other fields", () => {
    const result = getResetFieldValues("operationNameRadio", "yes");
    expect(result).toEqual({});
  });
});
