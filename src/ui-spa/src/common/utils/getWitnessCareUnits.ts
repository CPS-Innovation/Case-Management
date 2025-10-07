import { type CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";

export const getWitnessCareUnits = (
  data: CaseAreasAndWitnessCareUnits,
  selectedArea: string,
) => {
  return data.reduce<{ wcuId: number; wcuDescription: string }[]>(
    (acc, item) => {
      if (
        !acc.some((a) => a.wcuId === item.id) &&
        item.areaDescription === selectedArea &&
        item.isWCU
      ) {
        acc.push({
          wcuId: item.id,
          wcuDescription: item.description,
        });
      }
      return acc;
    },
    [],
  );
};
