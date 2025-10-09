import { type CaseAreasAndRegisteringUnits } from "../../common/types/responses/CaseAreasAndRegisteringUnits";
import { type CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";

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
  | "witnessCareUnitText";

export type CaseRegistrationState = {
  formData: {
    currentPage: "case-registration" | "case-area";
    operationNameRadio: string;
    suspectDetailsRadio: string;
    operationNameText: string;
    areaOrDivisionText: string;
    urnPoliceForceText?: string;
    urnPoliceUnitText?: string;
    urnUniqueReferenceText?: string;
    urnYearReferenceText?: string;
    registeringUnitText?: string;
    witnessCareUnitText?: string;
  };
  apiData: {
    areasAndRegisteringUnits: CaseAreasAndRegisteringUnits | null;
    areasAndWitnessCareUnits?: CaseAreasAndWitnessCareUnits | null;
  };
};

export const initialState: CaseRegistrationState = {
  formData: {
    currentPage: "case-registration",
    operationNameRadio: "",
    suspectDetailsRadio: "",
    operationNameText: "",
    areaOrDivisionText: "",
    urnPoliceForceText: "",
    urnPoliceUnitText: "",
    urnUniqueReferenceText: "",
    urnYearReferenceText: String(new Date().getFullYear()).slice(-2),
    registeringUnitText: "",
    witnessCareUnitText: "",
  },
  apiData: {
    areasAndRegisteringUnits: null,
    areasAndWitnessCareUnits: null,
  },
};

export type CaseRegistrationActions =
  | {
      type: "SET_FIELD";
      payload: { field: CaseRegistrationField; value: string };
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

    case "RESET_FORM_DATA": {
      return { ...state, formData: initialState.formData };
    }

    default:
      return state;
  }
};
