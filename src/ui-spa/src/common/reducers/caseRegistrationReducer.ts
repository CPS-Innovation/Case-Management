import type { CaseAreasAndRegisteringUnits } from "../../common/types/responses/CaseAreasAndRegisteringUnits";
import type { CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";
import type { CourtLocations } from "../types/responses/CourtLocations";
import type { CaseComplexities } from "../types/responses/CaseComplexities";
import type { CaseMonitoringCodes } from "../types/responses/CaseMonitoringCodes";
import type { CaseProsecutors } from "../types/responses/CaseProsecutors";
import type { CaseCaseworkers } from "../types/responses/CaseCaseworkers";
import type { InvestigatorTitles } from "../types/responses/InvestigatorTitles";
import type { PoliceUnits } from "../types/responses/PoliceUnits";
import type { Genders } from "../types/responses/Genders";
import type { Ethnicities } from "../types/responses/Ethnicities";
import type { Religions } from "../types/responses/Religions";
import type { OffenderTypes } from "../types/responses/OffenderTypes";
import type { Offences, Offence } from "../types/responses/Offences";
export type CaseRegistrationField =
  | "operationNameRadio"
  | "suspectDetailsRadio"
  | "operationNameText"
  | "areaOrDivisionText"
  | "urnPoliceForceText"
  | "urnPoliceUnitText"
  | "urnUniqueReferenceText"
  | "urnYearReferenceText"
  | "registeringUnitText"
  | "witnessCareUnitText"
  | "firstHearingRadio"
  | "firstHearingCourtLocationText"
  | "firstHearingDateText"
  | "caseComplexityRadio"
  | "caseMonitoringCodesCheckboxes"
  | "caseProsecutorRadio"
  | "caseInvestigatorRadio"
  | "caseProsecutorText"
  | "caseCaseworkerText"
  | "caseInvestigatorTitleSelect"
  | "caseInvestigatorFirstNameText"
  | "caseInvestigatorLastNameText"
  | "caseInvestigatorShoulderNameText"
  | "caseInvestigatorShoulderNumberText"
  | "wantToAddChargesRadio"
  | "victimsList";
export type SuspectAdditionalDetailValue =
  | "Date of Birth"
  | "Gender"
  | "Disability"
  | "Religion"
  | "Ethnicity"
  | "Alias details"
  | "Serious dangerous offender (SDO)"
  | "Arrest summons number (ASN)"
  | "Type of offender";

type SuspectTypeValue = "person" | "company" | "";
export type GeneralRadioValue = "yes" | "no" | "";
export type SuspectFormData = {
  addSuspectRadio: SuspectTypeValue;
  suspectFirstNameText: string;
  suspectLastNameText: string;
  suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[];
  suspectGenderRadio: { shortCode: string; description: string };
  suspectDisabilityRadio: GeneralRadioValue;
  suspectReligionRadio: { shortCode: string; description: string };
  suspectEthnicityRadio: { shortCode: string; description: string };
  suspectAliases: { firstName: string; lastName: string }[];
  suspectSDORadio: GeneralRadioValue;
  suspectASNText: string;
  suspectOffenderTypesRadio: {
    shortCode: string;
    display: string;
    arrestDate: string;
  };
  suspectCompanyNameText: string;
  suspectDOBDayText: string;
  suspectDOBMonthText: string;
  suspectDOBYearText: string;
  charges: ChargesFormData[];
};

export type VictimAdditionalDetailsValue =
  | "Vulnerable"
  | "Intimidated"
  | "Witness";
export type Victim = {
  victimFirstNameText: string;
  victimLastNameText: string;
  victimAdditionalDetailsCheckboxes: VictimAdditionalDetailsValue[];
};

export type ChargesFormData = {
  offenceSearchText: string;
  selectedOffence: Offence;
  offenceFromDate: string;
  offenceToDate: string;
  addVictimRadio: GeneralRadioValue;
  victim: Victim | null;
};
export type SuspectFieldNames = keyof SuspectFormData;
export type ChargeFieldNames = keyof ChargesFormData;

export type CaseRegistrationFormData = {
  operationNameRadio: string;
  suspectDetailsRadio: string;
  operationNameText: string;
  areaOrDivisionText: { id: number | null; description: string };
  urnPoliceForceText: string;
  urnPoliceUnitText: string;
  urnUniqueReferenceText: string;
  urnYearReferenceText: string;
  registeringUnitText: { id: number | null; description: string };
  witnessCareUnitText: { id: number | null; description: string };
  firstHearingRadio: string;
  firstHearingCourtLocationText: { id: number | null; description: string };
  firstHearingDateText: string;
  caseComplexityRadio: { shortCode: string; description: string };
  caseMonitoringCodesCheckboxes: string[];
  caseProsecutorRadio: string;
  caseInvestigatorRadio: string;
  caseProsecutorText: { id: number | null; description: string };
  caseCaseworkerText: { id: number | null; description: string };
  caseInvestigatorTitleSelect: {
    shortCode: string | null;
    display: string;
  };
  caseInvestigatorFirstNameText: string;
  caseInvestigatorLastNameText: string;
  caseInvestigatorShoulderNameText: string;
  caseInvestigatorShoulderNumberText: string;
  suspects: SuspectFormData[];
  wantToAddChargesRadio: GeneralRadioValue;
  victimsList: { firstName: string; lastName: string }[];
};

export type CaseRegistrationState = {
  formData: CaseRegistrationFormData;
  apiData: {
    areasAndRegisteringUnits: CaseAreasAndRegisteringUnits | null;
    areasAndWitnessCareUnits?: CaseAreasAndWitnessCareUnits | null;
    courtLocations?: CourtLocations | null;
    caseComplexities?: CaseComplexities | null;
    caseMonitoringCodes?: CaseMonitoringCodes | null;
    caseProsecutors?: CaseProsecutors | null;
    caseCaseworkers?: CaseCaseworkers | null;
    caseInvestigatorTitles?: InvestigatorTitles | null;
    policeUnits?: PoliceUnits | null;
    suspectGenders?: Genders | null;
    suspectEthnicities?: Ethnicities | null;
    suspectReligions?: Religions | null;
    suspectOffenderTypes?: OffenderTypes | null;
    offencesSearchResults?: Offences | null;
  };
};

export const suspectInitialState: SuspectFormData = {
  addSuspectRadio: "",
  suspectFirstNameText: "",
  suspectLastNameText: "",
  suspectAdditionalDetailsCheckboxes: [],
  suspectGenderRadio: { shortCode: "", description: "" },
  suspectDisabilityRadio: "",
  suspectReligionRadio: { shortCode: "", description: "" },
  suspectEthnicityRadio: { shortCode: "", description: "" },
  suspectAliases: [],
  suspectSDORadio: "",
  suspectASNText: "",
  suspectOffenderTypesRadio: { shortCode: "", display: "", arrestDate: "" },
  suspectCompanyNameText: "",
  suspectDOBDayText: "",
  suspectDOBMonthText: "",
  suspectDOBYearText: "",
  charges: [],
};

const chargeInitialState: ChargesFormData = {
  offenceSearchText: "",
  selectedOffence: {
    code: "",
    description: "",
    legislation: "",
    effectiveFromDate: "",
    effectiveToDate: "",
  },

  offenceFromDate: "",
  offenceToDate: "",
  addVictimRadio: "",
  victim: null,
};

export const initialState: CaseRegistrationState = {
  formData: {
    operationNameRadio: "",
    suspectDetailsRadio: "",
    operationNameText: "",
    areaOrDivisionText: { id: null, description: "" },
    urnPoliceForceText: "",
    urnPoliceUnitText: "",
    urnUniqueReferenceText: "",
    urnYearReferenceText: String(new Date().getFullYear()).slice(-2),
    registeringUnitText: { id: null, description: "" },
    witnessCareUnitText: { id: null, description: "" },
    firstHearingRadio: "",
    firstHearingCourtLocationText: { id: null, description: "" },
    firstHearingDateText: "",
    caseComplexityRadio: { shortCode: "", description: "" },
    caseMonitoringCodesCheckboxes: [],
    caseInvestigatorRadio: "",
    caseProsecutorRadio: "",
    caseProsecutorText: { id: null, description: "" },
    caseCaseworkerText: { id: null, description: "" },
    caseInvestigatorTitleSelect: { shortCode: null, display: "" },
    caseInvestigatorFirstNameText: "",
    caseInvestigatorLastNameText: "",
    caseInvestigatorShoulderNameText: "",
    caseInvestigatorShoulderNumberText: "",
    suspects: [],
    wantToAddChargesRadio: "",
    victimsList: [],
  },

  apiData: {
    areasAndRegisteringUnits: null,
    areasAndWitnessCareUnits: null,
    courtLocations: null,
    caseComplexities: null,
    caseMonitoringCodes: null,
    caseProsecutors: null,
    caseCaseworkers: null,
    caseInvestigatorTitles: null,
    suspectGenders: null,
    suspectEthnicities: null,
    suspectReligions: null,
    suspectOffenderTypes: null,
  },
};

export type CaseRegistrationActions =
  | {
      type: "SET_FIELD";
      payload: {
        field: CaseRegistrationField;
        value:
          | { id: number | null; description: string }
          | { shortCode: string | null; description: string }
          | { shortCode: string | null; display: string }
          | string
          | string[]
          | { firstName?: string; lastName: string }[];
      };
    }
  | {
      type: "SET_SUSPECT_FIELD";
      payload: {
        index: number;
        field: SuspectFieldNames;
        value:
          | SuspectAdditionalDetailValue[]
          | string
          | { shortCode: string; description: string }
          | { shortCode: string; display: string; arrestDate: string }
          | { firstName?: string; lastName: string }[];
      };
    }
  | {
      type: "SET_CHARGE_FIELDS";
      payload: {
        suspectIndex: number;
        chargeIndex: number;
        data: {
          offenceSearchText?: string;
          selectedOffence?: Offence;
          offenceFromDate?: string;
          offenceToDate?: string;
          addVictimRadio?: GeneralRadioValue;
          victim?: Victim | null;
        };
      };
    }
  | {
      type: "REMOVE_SUSPECT";
      payload: {
        index: number;
      };
    }
  | {
      type: "SET_AREAS_AND_REGISTERING_UNITS";
      payload: {
        areasAndRegisteringUnits: CaseAreasAndRegisteringUnits;
      };
    }
  | {
      type: "SET_AREAS_AND_WITNESS_CARE_UNITS";
      payload: {
        areasAndWitnessCareUnits: CaseAreasAndWitnessCareUnits;
      };
    }
  | {
      type: "SET_COURT_LOCATIONS";
      payload: {
        courtLocations: CourtLocations;
      };
    }
  | {
      type: "SET_CASE_COMPLEXITIES";
      payload: {
        caseComplexities: CaseComplexities;
      };
    }
  | {
      type: "SET_CASE_MONITORING_CODES";
      payload: {
        caseMonitoringCodes: CaseMonitoringCodes;
      };
    }
  | {
      type: "SET_CASE_PROSECUTORS";
      payload: {
        caseProsecutors: CaseProsecutors;
      };
    }
  | {
      type: "SET_CASE_CASEWORKERS";
      payload: {
        caseCaseworkers: CaseCaseworkers;
      };
    }
  | {
      type: "SET_CASE_INVESTIGATOR_TITLES";
      payload: {
        caseInvestigatorTitles: InvestigatorTitles;
      };
    }
  | {
      type: "SET_POLICE_UNITS";
      payload: {
        policeUnits: PoliceUnits;
      };
    }
  | {
      type: "SET_CASE_SUSPECT_GENDERS";
      payload: {
        suspectGenders: Genders;
      };
    }
  | {
      type: "SET_CASE_SUSPECT_ETHNICITIES";
      payload: {
        suspectEthnicities: Ethnicities;
      };
    }
  | {
      type: "SET_CASE_SUSPECT_RELIGIONS";
      payload: {
        suspectReligions: Religions;
      };
    }
  | {
      type: "SET_CASE_SUSPECT_OFFENDER_TYPES";
      payload: {
        suspectOffenderTypes: OffenderTypes;
      };
    }
  | {
      type: "SET_OFFENCES_SEARCH_RESULTS";
      payload: {
        offencesSearchResults: Offences;
      };
    }
  | {
      type: "RESET_FORM_DATA";
    }
  | {
      type: "RESET_SUSPECT_FIELD";
      payload: {
        index: number;
      };
    };

export type DispatchType = React.Dispatch<CaseRegistrationActions>;

export const caseRegistrationReducer = (
  state: CaseRegistrationState,
  action: CaseRegistrationActions,
): CaseRegistrationState => {
  switch (action.type) {
    case "SET_FIELD": {
      const resetValues = getResetFieldValues(
        action.payload.field,
        action.payload.value as string,
      );
      return {
        ...state,
        formData: {
          ...state.formData,
          ...resetValues,
          [action.payload.field]: action.payload.value,
        },
      };
    }
    case "SET_SUSPECT_FIELD": {
      if (action.payload.index > state.formData.suspects.length) {
        return state;
      }

      const suspects = [...state.formData.suspects];
      const existing = suspects[action.payload.index] ?? suspectInitialState;
      suspects[action.payload.index] = {
        ...existing,
        [action.payload.field]: action.payload.value,
      };
      return {
        ...state,
        formData: {
          ...state.formData,
          suspects,
        },
      };
    }

    case "SET_CHARGE_FIELDS": {
      const { suspectIndex, chargeIndex, data } = action.payload;
      if (suspectIndex > state.formData.suspects.length) {
        return state;
      }

      const suspect = state.formData.suspects[suspectIndex];
      const existingCharges =
        suspect.charges[chargeIndex] ?? chargeInitialState;
      suspect.charges[chargeIndex] = {
        ...existingCharges,
        ...data,
      };
      const suspects = [...state.formData.suspects];
      suspects[suspectIndex] = {
        ...suspect,
      };
      return {
        ...state,
        formData: {
          ...state.formData,
          suspects,
        },
      };
    }

    case "RESET_SUSPECT_FIELD": {
      const suspectResetValues = getResetSuspectFieldValues(
        state,
        action.payload.index,
      );
      return {
        ...state,
        formData: {
          ...state.formData,
          suspects: state.formData.suspects.map((suspect, i) =>
            i === action.payload.index
              ? { ...suspect, ...suspectResetValues }
              : suspect,
          ),
        },
      };
    }
    case "REMOVE_SUSPECT": {
      const suspects = state.formData.suspects.filter(
        (_, i) => i !== action.payload.index,
      );
      return {
        ...state,
        formData: {
          ...state.formData,
          suspects,
        },
      };
    }
    case "SET_AREAS_AND_REGISTERING_UNITS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          areasAndRegisteringUnits: action.payload.areasAndRegisteringUnits,
        },
      };
    }
    case "SET_AREAS_AND_WITNESS_CARE_UNITS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          areasAndWitnessCareUnits: action.payload.areasAndWitnessCareUnits,
        },
      };
    }
    case "SET_COURT_LOCATIONS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          courtLocations: action.payload.courtLocations,
        },
      };
    }
    case "SET_CASE_COMPLEXITIES": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          caseComplexities: action.payload.caseComplexities,
        },
      };
    }
    case "SET_CASE_MONITORING_CODES": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          caseMonitoringCodes: action.payload.caseMonitoringCodes,
        },
      };
    }

    case "SET_CASE_PROSECUTORS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          caseProsecutors: action.payload.caseProsecutors,
        },
      };
    }
    case "SET_CASE_CASEWORKERS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          caseCaseworkers: action.payload.caseCaseworkers,
        },
      };
    }
    case "SET_CASE_INVESTIGATOR_TITLES": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          caseInvestigatorTitles: action.payload.caseInvestigatorTitles,
        },
      };
    }

    case "SET_POLICE_UNITS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          policeUnits: action.payload.policeUnits,
        },
      };
    }

    case "RESET_FORM_DATA": {
      return { ...state, formData: initialState.formData };
    }

    case "SET_CASE_SUSPECT_GENDERS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          suspectGenders: action.payload.suspectGenders,
        },
      };
    }
    case "SET_CASE_SUSPECT_ETHNICITIES": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          suspectEthnicities: action.payload.suspectEthnicities,
        },
      };
    }
    case "SET_CASE_SUSPECT_RELIGIONS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          suspectReligions: action.payload.suspectReligions,
        },
      };
    }
    case "SET_CASE_SUSPECT_OFFENDER_TYPES": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          suspectOffenderTypes: action.payload.suspectOffenderTypes,
        },
      };
    }

    case "SET_OFFENCES_SEARCH_RESULTS": {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          offencesSearchResults: action.payload.offencesSearchResults,
        },
      };
    }

    default:
      return state;
  }
};

export const getResetFieldValues = (
  fieldName: CaseRegistrationField,
  value: string,
) => {
  if (fieldName === "caseProsecutorRadio" && value === "no") {
    return {
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
    };
  }
  if (fieldName === "caseInvestigatorRadio" && value === "no") {
    return {
      caseInvestigatorTitleSelect: { shortCode: null, display: "" },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
    };
  }
  if (fieldName === "firstHearingRadio" && value === "no") {
    return {
      firstHearingCourtLocationText: { id: null, description: "" },
      firstHearingDateText: "",
    };
  }
  if (fieldName === "suspectDetailsRadio" && value === "no") {
    return {
      suspects: [],
    };
  }

  return {};
};

export const getResetSuspectFieldValues = (
  state: CaseRegistrationState,
  index: number,
) => {
  const suspect = state.formData.suspects[index];
  if (!suspect) return {};

  let resetValues: Partial<SuspectFormData> = {};

  if (suspect.addSuspectRadio === "company") {
    const {
      suspectCompanyNameText: _suspectCompanyNameText,
      addSuspectRadio: _addSuspectRadio,
      ...rest
    } = suspectInitialState;
    resetValues = { ...rest };
    return resetValues;
  }
  if (suspect.addSuspectRadio === "person") {
    resetValues.suspectCompanyNameText = "";
  }

  return resetSuspectAdditionalDetails(
    suspect.suspectAdditionalDetailsCheckboxes,
    resetValues,
  );
};

const resetSuspectAdditionalDetails = (
  value: SuspectAdditionalDetailValue[],
  resetValues: Partial<SuspectFormData>,
) => {
  if (!value.includes("Date of Birth")) {
    resetValues.suspectDOBDayText = "";
    resetValues.suspectDOBMonthText = "";
    resetValues.suspectDOBYearText = "";
  }
  if (!value.includes("Gender")) {
    resetValues.suspectGenderRadio = { shortCode: "", description: "" };
  }
  if (!value.includes("Disability")) {
    resetValues.suspectDisabilityRadio = "";
  }
  if (!value.includes("Religion")) {
    resetValues.suspectReligionRadio = { shortCode: "", description: "" };
  }
  if (!value.includes("Ethnicity")) {
    resetValues.suspectEthnicityRadio = { shortCode: "", description: "" };
  }
  if (!value.includes("Alias details")) {
    resetValues.suspectAliases = [];
  }
  if (!value.includes("Serious dangerous offender (SDO)")) {
    resetValues.suspectSDORadio = "";
  }
  if (!value.includes("Arrest summons number (ASN)")) {
    resetValues.suspectASNText = "";
  }
  if (!value.includes("Type of offender")) {
    resetValues.suspectOffenderTypesRadio = {
      shortCode: "",
      display: "",
      arrestDate: "",
    };
  }

  return resetValues;
};
