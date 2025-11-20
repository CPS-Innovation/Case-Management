import {
  caseRegistrationReducer,
  initialState,
  suspectInitialState,
  getResetSuspectFieldValues,
  getResetFieldValues,
  type CaseRegistrationActions,
  type CaseRegistrationState,
} from "./caseRegistrationReducer";

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

  it("should set formData operationNameText data using SET_FIELD action", () => {
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
        suspects: [],
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

  it("should not allow to  set suspect data suspectFirstNameText data using SET_SUSPECT_FIELD action if the payload index is greater than current suspect length", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: 1,
        field: "suspectFirstNameText",
        value: "John",
      },
    };
    const state = caseRegistrationReducer(initialState, action);

    expect(state.formData.suspects[0]).toEqual(
      initialState.formData.suspects[0],
    );
  });

  it("should set suspect data suspectFirstNameText data along with other fields initial value using SET_SUSPECT_FIELD action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: 0,
        field: "suspectFirstNameText",
        value: "John",
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectFirstNameText: "John",
    };
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("should set suspect data suspectAliases data along with other fields initial value using SET_SUSPECT_FIELD action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: 0,
        field: "suspectAliases",
        value: [{ firstName: "John", lastName: "Doe" }],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectAliases: [
        {
          firstName: "John",
          lastName: "Doe",
        },
      ],
    };
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("should just set suspect data suspectFirstNameText  using SET_SUSPECT_FIELD action, when suspect details are already available", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: 0,
        field: "suspectFirstNameText",
        value: "Jacob",
      },
    };

    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectFirstNameText: "John",
            suspectLastNameText: "Doe",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectLastNameText: "Doe",
      suspectFirstNameText: "Jacob",
    };
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("should reset the suspect data to initial values if the user updates the additional details checkboxes", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            addSuspectRadio: "person",
            suspectFirstNameText: "rr",
            suspectLastNameText: "last",
            suspectAdditionalDetailsCheckboxes: [
              "Date of Birth",
              "Disability",
              "Religion",
              "Ethnicity",
              "Alias details",
              "Arrest summons number (ASN)",
              "Serious dangerous offender (SDO)",
              "Type of offender",
            ],
            suspectGenderRadio: { shortCode: "M", description: "male" },
            suspectDisabilityRadio: "no",
            suspectReligionRadio: { shortCode: "ch", description: "Christian" },
            suspectEthnicityRadio: { shortCode: "BR", description: "British" },
            suspectAliases: [{ firstName: "aa", lastName: "bb" }],
            suspectSDORadio: "yes",
            suspectASNText: "abc123",
            suspectOffenderTypesRadio: {
              shortCode: "yo",
              display: "yOUTH OFFENDER (YO)",
              arrestDate: "12/12/2020",
            },
            suspectCompanyNameText: "",
            suspectDOBDayText: "12",
            suspectDOBMonthText: "12",
            suspectDOBYearText: "2000",
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: 0,
        field: "suspectAdditionalDetailsCheckboxes",
        value: [],
      },
    };
    const expectedResult = {
      ...suspectInitialState,
      addSuspectRadio: "person",
      suspectFirstNameText: "rr",
      suspectLastNameText: "last",
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("Should remove a suspect at given index using REMOVE_SUSPECT action", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          { ...suspectInitialState },
          {
            ...suspectInitialState,
            addSuspectRadio: "person",
            suspectLastNameText: "last",
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT",
      payload: {
        index: 0,
      },
    };

    const state = caseRegistrationReducer(modifiedState, action);
    expect(state.formData.suspects.length).toEqual(1);
    expect(state.formData.suspects[0].suspectLastNameText).toEqual("last");
  });

  it("getResetSuspectFieldValues should reset person suspects values to initial state if the user switches from addSuspectRadio from person to company", () => {
    const resetValues = getResetSuspectFieldValues(
      "addSuspectRadio",
      "company",
    );
    const {
      suspectCompanyNameText: _suspectCompanyNameText,
      addSuspectRadio: _addSuspectRadio,
      ...rest
    } = suspectInitialState;
    expect(resetValues).toEqual({ ...rest });
  });
  it("getResetSuspectFieldValues should reset company suspects values to initial state if the user switches from addSuspectRadio from company to person", () => {
    const resetValues = getResetSuspectFieldValues("addSuspectRadio", "person");

    expect(resetValues).toEqual({ suspectCompanyNameText: "" });
  });

  it("getResetSuspectFieldValues should return empty object if none of the fields match", () => {
    const resetValues = getResetSuspectFieldValues("addSuspectRadio", "");

    expect(resetValues).toEqual({});
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

  it("Should set apiData suspectGenders data using SET_CASE_SUSPECT_GENDERS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_GENDERS",
      payload: {
        suspectGenders: [
          { shortCode: "male", description: "Male" },
          { shortCode: "female", description: "Female" },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectGenders).toEqual(action.payload.suspectGenders);
  });

  it("Should set apiData suspectEthnicities data using SET_CASE_SUSPECT_ETHNICITIES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_ETHNICITIES",
      payload: {
        suspectEthnicities: [
          { shortCode: "black", description: "Black" },
          { shortCode: "white", description: "White" },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectEthnicities).toEqual(
      action.payload.suspectEthnicities,
    );
  });

  it("Should set apiData suspectReligions data using SET_CASE_SUSPECT_RELIGIONS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_RELIGIONS",
      payload: {
        suspectReligions: [
          { shortCode: "christian", description: "Christian" },
          { shortCode: "Buddhist", description: "Buddhist" },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectReligions).toEqual(
      action.payload.suspectReligions,
    );
  });

  it("Should set apiData suspectOffenderTypes data using SET_CASE_SUSPECT_OFFENDER_TYPE", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_OFFENDER_TYPES",
      payload: {
        suspectOffenderTypes: [
          {
            shortCode: "PPO",
            description: "Prolific priority offender",
            display: "Prolific priority offender (PPO)",
          },
          {
            shortCode: "PYO",
            description: "Prolific youth offender",
            display: "Prolific youth offender (PYO)",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectOffenderTypes).toEqual(
      action.payload.suspectOffenderTypes,
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
