import { z } from "zod";

export const caseAreasAndRegisteringUnitSchema = z.object({
  areaId: z.number(),
  areaDescription: z.string(),
  areaIsSensitive: z.boolean(),
  id: z.number(),
  description: z.string(),
});

export const caseAreasAndRegisteringUnitsSchema = z.object({
  allUnits: z.array(caseAreasAndRegisteringUnitSchema),
  homeUnit: caseAreasAndRegisteringUnitSchema,
});

export type CaseAreasAndRegisteringUnit = z.infer<
  typeof caseAreasAndRegisteringUnitSchema
>;
export type CaseAreasAndRegisteringUnits = z.infer<
  typeof caseAreasAndRegisteringUnitsSchema
>;
