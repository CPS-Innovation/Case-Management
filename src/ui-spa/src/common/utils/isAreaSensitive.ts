import { type CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

export const isAreaSensitive = (
  areasAndRegisteringUnits: CaseAreasAndRegisteringUnits | null,
): boolean => {
  if (!areasAndRegisteringUnits) return false;

  return areasAndRegisteringUnits.homeUnit.areaIsSensitive;
};
