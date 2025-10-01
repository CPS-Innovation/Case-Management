export type CaseRegistrationField =
  | "operationNameRadio"
  | "suspectDetailsRadio"
  | "operationName";

export type CaseRegistrationState = {
  currentPage: "case-registration" | "case-area";
  operationNameRadio: string;
  suspectDetailsRadio: string;
  operationNameText: string;
};

export const initialState: CaseRegistrationState = {
  currentPage: "case-registration",
  operationNameRadio: "",
  suspectDetailsRadio: "",
  operationNameText: "",
};

export const CaseRegistrationFieldTypes = {
  operationNameRadio: "operationNameRadio",
  suspectDetailsRadio: "suspectDetailsRadio",
  operationNameText: "operationNameText",
} as const;
export type CaseRegistrationActions =
  | {
      type: "SET_FIELD";
      payload: { field: CaseRegistrationField; value: string };
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
        [action.payload.field]: action.payload.value,
      };
    }

    case "RESET_FORM": {
      return initialState;
    }

    default:
      return state;
  }
};
