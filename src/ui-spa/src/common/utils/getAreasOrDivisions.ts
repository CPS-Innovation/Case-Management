import { type CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

export const getAreasOrDivisions = (data: CaseAreasAndRegisteringUnits) => {
  return data.allUnits.reduce<{ areaId: number; areaDescription: string }[]>(
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
