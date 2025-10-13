import { type CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";

export const getWitnessCareUnits = (
  data: CaseAreasAndWitnessCareUnits,
  selectedArea: string,
) => {
  return data.reduce<{ id: number; description: string }[]>((acc, item) => {
    if (
      !acc.some((a) => a.id === item.id) &&
      item.areaDescription === selectedArea &&
      item.isWCU
    ) {
      acc.push({
        id: item.id,
        description: item.description,
      });
    }
    return acc;
  }, []);
};
