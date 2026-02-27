import { z } from "zod";

export const offenceSchema = z.object({
  code: z.string(),
  description: z.string(),
  legislation: z.string(),
  effectiveFromDate: z.string(),
  effectiveToDate: z.string().nullable(),
  modeOfTrial: z.string(),
});

export const offencesSchema = z.object({
  offences: z.array(offenceSchema),
  total: z.number(),
});

export type Offence = z.infer<typeof offenceSchema>;
export type Offences = z.infer<typeof offencesSchema>;
