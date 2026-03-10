import { createContext, useReducer, useMemo } from "react";
import {
  caseRegistrationReducer,
  initialState,
  type CaseRegistrationActions,
  type CaseRegistrationState,
} from "../reducers/caseRegistrationReducer";

const CaseRegistrationFormContext = createContext<{
  state: CaseRegistrationState;
  dispatch: React.Dispatch<CaseRegistrationActions>;
}>({ state: initialState, dispatch: () => null });

const loadFromSessionStorage = (): CaseRegistrationState => {
  console.log("Loading state from sessionStorage");
  const serializedState = sessionStorage.getItem("caseRegistration");
  if (!serializedState) return initialState;

  try {
    const state = JSON.parse(serializedState);
    return state;
  } catch (error) {
    console.error("Error loading state from sessionStorage:", error);
    return initialState;
  }
};

const CaseRegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(
    caseRegistrationReducer,
    initialState,
    loadFromSessionStorage,
  );

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <CaseRegistrationFormContext.Provider value={contextValue}>
      {children}
    </CaseRegistrationFormContext.Provider>
  );
};

export { CaseRegistrationFormContext, CaseRegistrationProvider };
