import { z } from "zod";

export const genderSchema = z.object({
  shortCode: z.string(),
  description: z.string(),
});

export const gendersSchema = z.array(genderSchema);

export type Gender = z.infer<typeof genderSchema>;
export type Genders = z.infer<typeof gendersSchema>;
