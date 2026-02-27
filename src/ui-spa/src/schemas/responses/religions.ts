import { z } from "zod";

export const religionSchema = z.object({
  shortCode: z.string(),
  description: z.string(),
});

export const religionsSchema = z.array(religionSchema);

export type Religion = z.infer<typeof religionSchema>;
export type Religions = z.infer<typeof religionsSchema>;
