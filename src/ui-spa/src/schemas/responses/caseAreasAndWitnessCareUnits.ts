import { z } from "zod";

export const caseAreasAndWitnessCareUnitSchema = z.object({
  areaId: z.number(),
  areaDescription: z.string(),
  id: z.number(),
  description: z.string(),
  isWCU: z.boolean(),
});

export const caseAreasAndWitnessCareUnitsSchema = z.array(
  caseAreasAndWitnessCareUnitSchema,
);

export type CaseAreasAndWitnessCareUnit = z.infer<
  typeof caseAreasAndWitnessCareUnitSchema
>;
export type CaseAreasAndWitnessCareUnits = z.infer<
  typeof caseAreasAndWitnessCareUnitsSchema
>;
