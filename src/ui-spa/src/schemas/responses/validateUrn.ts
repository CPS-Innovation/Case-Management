import { z } from "zod";

export const validateUrnSchema = z.boolean();
export type ValidateUrn = z.infer<typeof validateUrnSchema>;
