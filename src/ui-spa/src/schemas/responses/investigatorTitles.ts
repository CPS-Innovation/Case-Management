import { z } from "zod";

export const investigatorTitleSchema = z.object({
  shortCode: z.string(),
  description: z.string(),
  display: z.string(),
  isPoliceTitle: z.boolean(),
});

export const investigatorTitlesSchema = z.array(investigatorTitleSchema);

export type InvestigatorTitle = z.infer<typeof investigatorTitleSchema>;
export type InvestigatorTitles = z.infer<typeof investigatorTitlesSchema>;
