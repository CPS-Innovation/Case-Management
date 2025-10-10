import { type CaseAreasAndRegisteringUnits } from "../../common/types/responses/CaseAreasAndRegisteringUnits";
import { type CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";
import type { CourtLocations } from "../types/responses/CourtLocations";

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
  | "firstHearingDateText";

export type CaseRegistrationState = {
  formData: {
    currentPage: "case-registration" | "case-area";
    operationNameRadio: string;
    suspectDetailsRadio: string;
    operationNameText: string;
    areaOrDivisionText: { id: number | null; description: string };
    urnPoliceForceText?: string;
    urnPoliceUnitText?: string;
    urnUniqueReferenceText?: string;
    urnYearReferenceText?: string;
    registeringUnitText?: { id: number | null; description: string };
    witnessCareUnitText?: { id: number | null; description: string };
    firstHearingRadio?: string;
    firstHearingCourtLocationText?: { id: number | null; description: string };
    firstHearingDateText?: string;
  };
  apiData: {
    areasAndRegisteringUnits: CaseAreasAndRegisteringUnits | null;
    areasAndWitnessCareUnits?: CaseAreasAndWitnessCareUnits | null;
    courtLocations?: CourtLocations | null;
  };
};

export const initialState: CaseRegistrationState = {
  formData: {
    currentPage: "case-registration",
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
  },
  apiData: {
    areasAndRegisteringUnits: null,
    areasAndWitnessCareUnits: null,
    courtLocations: null,
  },
};

export type CaseRegistrationActions =
  | {
      type: "SET_FIELD";
      payload: {
        field: CaseRegistrationField;
        value: { id: number | null; description: string } | string;
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
  | { type: "RESET_FORM_DATA" };

export type DispatchType = React.Dispatch<CaseRegistrationActions>;

export const caseRegistrationReducer = (
  state: CaseRegistrationState,
  action: CaseRegistrationActions,
): CaseRegistrationState => {
  switch (action.type) {
    case "SET_FIELD": {
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
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

    case "RESET_FORM_DATA": {
      return { ...state, formData: initialState.formData };
    }

    default:
      return state;
  }
};
