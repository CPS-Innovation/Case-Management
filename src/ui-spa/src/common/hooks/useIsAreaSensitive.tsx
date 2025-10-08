import { useMemo, useContext } from "react";
import { CaseRegistrationFormContext } from "../providers/CaseRegistrationProvider";

export const useISAreaSensitive = () => {
  const { state } = useContext(CaseRegistrationFormContext);
  const isAreaSensitive = useMemo(() => {
    return state.apiData.areasAndRegisteringUnits?.homeUnit.areaIsSensitive;
  }, [state.apiData.areasAndRegisteringUnits?.homeUnit.areaIsSensitive]);

  return isAreaSensitive;
};
