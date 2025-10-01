import { type CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";
export const getAreasorDivisions = (data: CaseAreasAndRegisteringUnits) => {
  return data.reduce<{ areaId: number; areaDescription: string }[]>(
    (acc, item) => {
      if (!acc.some((a) => a.areaId === item.areaId)) {
        acc.push({
          areaId: item.areaId,
          areaDescription: item.areaDescription,
        });
      }
      return acc;
    },
    [],
  );
};
