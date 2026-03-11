import { z } from "zod";

export const offenderTypeSchema = z.object({
  shortCode: z.string(),
  description: z.string(),
  display: z.string(),
});

export const offenderTypesSchema = z.array(offenderTypeSchema);

export type OffenderType = z.infer<typeof offenderTypeSchema>;
export type OffenderTypes = z.infer<typeof offenderTypesSchema>;
