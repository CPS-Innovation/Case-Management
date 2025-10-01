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
    expect(state.operationNameRadio).toBe("yes");
    expect(state.suspectDetailsRadio).toBe("");
    expect(state.operationNameText).toBe("");
  });

  it("should set suspectDetailsRadio", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "suspectDetailsRadio", value: "Area 51" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.suspectDetailsRadio).toBe("Area 51");
  });

  it("should set operationNameText", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELD",
      payload: { field: "operationNameText", value: "Operation Thunder" },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.operationNameText).toBe("Operation Thunder");
  });

  it("should reset the form", () => {
    const modifiedState: CaseRegistrationState = {
      currentPage: "case-area",
      operationNameRadio: "yes",
      suspectDetailsRadio: "Area 51",
      operationNameText: "Operation Thunder",
    };
    const action: CaseRegistrationActions = { type: "RESET_FORM" };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(initialState);
  });

  it("should return current state for unknown action", () => {
    // @ts-expect-error Testing unknown action type
    const state = caseRegistrationReducer(initialState, { type: "UNKNOWN" });
    expect(state).toBe(initialState);
  });
});
