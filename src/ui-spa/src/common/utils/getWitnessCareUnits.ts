import { type CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";

export const getWitnessCareUnits = (
  data: CaseAreasAndWitnessCareUnits,
  selectedArea: string,
) => {
  return data.reduce<{ unitId: number; unitDescription: string }[]>(
    (acc, item) => {
      if (
        !acc.some((a) => a.unitId === item.id) &&
        item.areaDescription === selectedArea &&
        item.isWCU
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
