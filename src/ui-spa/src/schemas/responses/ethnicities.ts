import { z } from "zod";

export const ethnicitySchema = z.object({
  shortCode: z.string(),
  description: z.string(),
});

export const ethnicitiesSchema = z.array(ethnicitySchema);

export type Ethnicity = z.infer<typeof ethnicitySchema>;
export type Ethnicities = z.infer<typeof ethnicitiesSchema>;
