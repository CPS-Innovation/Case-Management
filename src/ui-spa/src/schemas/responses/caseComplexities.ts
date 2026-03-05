import { z } from "zod";

export const caseComplexitySchema = z.object({
  shortCode: z.string(),
  description: z.string(),
});

export const caseComplexitiesSchema = z.array(caseComplexitySchema);

export type CaseComplexity = z.infer<typeof caseComplexitySchema>;

export type CaseComplexities = z.infer<typeof caseComplexitiesSchema>;
