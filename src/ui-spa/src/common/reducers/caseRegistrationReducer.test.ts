import {
  caseRegistrationReducer,
  initialState,
  type CaseRegistrationActions,
  type CaseRegistrationState,
} from "./caseRegistrationReducer";

describe("caseRegistrationReducer", () => {
  it("should set operationNameRadio", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "operationNameRadio", value: "yes" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.operationNameRadio).toBe("yes");
    expect(state.formData.suspectDetailsRadio).toBe("");
    expect(state.formData.operationNameText).toBe("");
  });

  it("should set suspectDetailsRadio", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "suspectDetailsRadio", value: "Area 51" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.suspectDetailsRadio).toBe("Area 51");
  });

  it("should set operationNameText", () => {
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
        currentPage: "case-area",
        operationNameRadio: "yes",
        suspectDetailsRadio: "Area 51",
        operationNameText: "Operation Thunder",
        areaOrDivisionText: "Division A",
        urnPoliceForceText: "Force X",
        urnPoliceUnitText: "Unit Y",
        urnUniqueReferenceText: "12345",
        urnYearReferenceText: "24",
        registeringUnitText: "Reg Unit 1",
        witnessCareUnitText: "Witness Unit 1",
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
});
