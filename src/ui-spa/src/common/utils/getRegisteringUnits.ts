import { type CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

export const getRegisteringUnits = (
  data: CaseAreasAndRegisteringUnits,
  selectedArea: string,
) => {
  return data.allUnits.reduce<{ id: number; description: string }[]>(
    (acc, item) => {
      if (
        !acc.some((a) => a.id === item.id) &&
        item.areaDescription === selectedArea
      ) {
        acc.push({
          id: item.id,
          description: item.description,
        });
      }
      return acc;
    },
    [],
  );
};
