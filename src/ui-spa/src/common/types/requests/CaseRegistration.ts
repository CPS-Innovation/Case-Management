export type CaseRegistration = {
  urn: {
    policeForce: string;
    policeUnit: string;
    uniqueRef: string;
    year: number;
  };
  registeringAreaId: number;
  registeringUnitId: number;
  allocateWcuId: number;
  operationName: string;
  courtLocationId: number;
  courtLocationName: string;
  hearingDate: string;
  complexity: string;
  monitoringCodes: { code: string; selected: boolean }[];
  prosecutorId: number;
  caseWorker: string;
  ociRank: string;
  ociSurname: string;
  ociFirstName: string;
  ociShoulderNumber: string;
  ociPoliceUnit: string;
};
