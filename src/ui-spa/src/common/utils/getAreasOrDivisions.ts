import { type CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

export const getAreasOrDivisions = (data: CaseAreasAndRegisteringUnits) => {
  return data.allUnits.reduce<{ id: number; description: string }[]>(
    (acc, item) => {
      if (!acc.some((a) => a.id === item.areaId)) {
        acc.push({
          id: item.areaId,
          description: item.areaDescription,
        });
      }
      return acc;
    },
    [],
  );
};
