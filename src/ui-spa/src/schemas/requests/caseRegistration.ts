import { z } from "zod";

export const caseRegistrationSchema = z.object({
  urn: {
    policeForce: z.string(),
    policeUnit: z.string(),
    uniqueRef: z.string(),
    year: z.number(),
  },
  registeringAreaId: z.number(),
  registeringUnitId: z.number(),
  allocateWcuId: z.number(),
  operationName: z.string(),
  courtLocationId: z.number(),
  courtLocationName: z.string(),
  hearingDate: z.string().nullable(),
  complexity: z.string(),
  monitoringCodes: z.array(
    z.object({ code: z.string(), selected: z.boolean() }),
  ),
  prosecutorId: z.number(),
  caseWorker: z.string(),
  ociRank: z.string(),
  ociSurname: z.string(),
  ociFirstName: z.string(),
  ociShoulderNumber: z.string(),
  ociPoliceUnit: z.string(),
});

export type CaseRegistration = z.infer<typeof caseRegistrationSchema>;
