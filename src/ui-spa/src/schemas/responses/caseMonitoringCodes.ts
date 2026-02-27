import { z } from "zod";

export const caseMonitoringCodeSchema = z.object({
  code: z.string(),
  description: z.string(),
  display: z.string(),
});

export const caseMonitoringCodesSchema = z.array(caseMonitoringCodeSchema);

export type CaseMonitoringCode = z.infer<typeof caseMonitoringCodeSchema>;
export type CaseMonitoringCodes = z.infer<typeof caseMonitoringCodesSchema>;
