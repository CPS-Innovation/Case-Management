import { z } from "zod";

export const policeUnitSchema = z.object({
  unitId: z.number(),
  unitDescription: z.string(),
  code: z.string(),
  description: z.string(),
});

export const policeUnitsSchema = z.array(policeUnitSchema);

export type PoliceUnit = z.infer<typeof policeUnitSchema>;
export type PoliceUnits = z.infer<typeof policeUnitsSchema>;
