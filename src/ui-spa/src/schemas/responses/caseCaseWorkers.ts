import { z } from "zod";

export const caseCaseworkerSchema = z.object({
  id: z.number(),
  description: z.string(),
});

export const caseCaseworkersSchema = z.array(caseCaseworkerSchema);

export type CaseCaseworker = z.infer<typeof caseCaseworkerSchema>;
export type CaseCaseworkers = z.infer<typeof caseCaseworkersSchema>;
