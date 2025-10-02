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

const CaseRegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(
    caseRegistrationReducer,
    initialState,
    (init) => init,
  );

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <CaseRegistrationFormContext.Provider value={contextValue}>
      {children}
    </CaseRegistrationFormContext.Provider>
  );
};

export { CaseRegistrationFormContext, CaseRegistrationProvider };
