import { z } from "zod";

export const caseRegistrationResponseSchema = z.object({
  caseId: z.number(),
});
export type CaseRegistrationResponse = z.infer<
  typeof caseRegistrationResponseSchema
>;
