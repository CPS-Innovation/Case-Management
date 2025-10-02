import { type CaseAreasAndRegisteringUnits } from "../../common/types/responses/CaseAreasAndRegisteringUnits";

export type CaseRegistrationField =
  | "operationNameRadio"
  | "suspectDetailsRadio"
  | "operationNameText"
  | "areaOrDivisionText";

export type CaseRegistrationState = {
  formData: {
    currentPage: "case-registration" | "case-area";
    operationNameRadio: string;
    suspectDetailsRadio: string;
    operationNameText: string;
    areaOrDivisionText: string;
  };
  apiData: {
    areasAndRegisteringUnits: CaseAreasAndRegisteringUnits | null;
  };
};

export const initialState: CaseRegistrationState = {
  formData: {
    currentPage: "case-registration",
    operationNameRadio: "",
    suspectDetailsRadio: "",
    operationNameText: "",
    areaOrDivisionText: "",
  },
  apiData: {
    areasAndRegisteringUnits: null,
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
  | { type: "RESET_FORM" };

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

    case "RESET_FORM": {
      return initialState;
    }

    default:
      return state;
  }
};
