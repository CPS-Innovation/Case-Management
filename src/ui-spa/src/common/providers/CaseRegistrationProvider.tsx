import { createContext, useEffect, useReducer, useMemo } from "react";
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
    (init) => {
      const stored = null;
      return stored ? { ...init, ...JSON.parse(stored) } : init;
    },
  );

  useEffect(() => {
    localStorage.setItem("caseForm", JSON.stringify(state));
  }, [state]);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <CaseRegistrationFormContext.Provider value={contextValue}>
      {children}
    </CaseRegistrationFormContext.Provider>
  );
};

export { CaseRegistrationFormContext, CaseRegistrationProvider };
