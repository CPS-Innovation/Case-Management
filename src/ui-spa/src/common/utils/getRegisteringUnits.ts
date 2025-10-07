import { type CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

export const getRegisteringUnits = (
  data: CaseAreasAndRegisteringUnits,
  selectedArea: string,
) => {
  return data.allUnits.reduce<{ unitId: number; unitDescription: string }[]>(
    (acc, item) => {
      if (
        !acc.some((a) => a.unitId === item.id) &&
        item.areaDescription === selectedArea
      ) {
        acc.push({
          unitId: item.id,
          unitDescription: item.description,
        });
      }
      return acc;
    },
    [],
  );
};
