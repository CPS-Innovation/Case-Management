import { z } from "zod";

export const tagColorSchema = z.enum([
  "grey",
  "purple",
  "turquoise",
  "blue",
  "yellow",
  "orange",
  "red",
  "pink",
  "green",
]);

export type TagColor = z.infer<typeof tagColorSchema>;
