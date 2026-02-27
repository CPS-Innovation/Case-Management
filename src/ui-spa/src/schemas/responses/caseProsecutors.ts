import { z } from "zod";

export const caseProsecutorSchema = z.object({
  id: z.number(),
  description: z.string(),
});

export const caseProsecutorsSchema = z.array(caseProsecutorSchema);

export type CaseProsecutor = z.infer<typeof caseProsecutorSchema>;
export type CaseProsecutors = z.infer<typeof caseProsecutorsSchema>;
