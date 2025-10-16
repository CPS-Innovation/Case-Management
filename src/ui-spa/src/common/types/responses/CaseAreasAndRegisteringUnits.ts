export type CaseAreasAndRegisteringUnit = {
  areaId: number;
  areaDescription: string;
  areaIsSensitive: boolean;
  id: number;
  description: string;
};

export type CaseAreasAndRegisteringUnits = {
  allUnits: CaseAreasAndRegisteringUnit[];
  homeUnit: CaseAreasAndRegisteringUnit;
};
