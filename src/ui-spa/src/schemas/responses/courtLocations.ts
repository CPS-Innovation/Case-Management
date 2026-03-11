import { z } from "zod";

export const courtLocationSchema = z.object({
  id: z.number(),
  description: z.string(),
});

export const courtLocationsSchema = z.array(courtLocationSchema);

export type CourtLocation = z.infer<typeof courtLocationSchema>;
export type CourtLocations = z.infer<typeof courtLocationsSchema>;
