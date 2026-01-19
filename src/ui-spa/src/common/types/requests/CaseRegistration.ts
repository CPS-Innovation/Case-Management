export type CaseRegistration = {
  urn: {
    policeForce: string;
    policeUnit: string;
    uniqueRef: string;
    year: number;
  };
  registeringAreaId: number;
  registeringUnitId: number;
  allocatedWcuId: number;
  operationName: string;
  courtLocationId: number;
  courtLocationName: string;
  hearingDate: string | null;
  complexity: string;
  monitoringCodes: { code: string; selected: boolean }[];
  prosecutorId: number;
  caseWorker: string;
  oicRank: string;
  oicSurname: string;
  oicFirstnames: string;
  oicShoulderNumber: string;
  oicPoliceUnit: string;
  victims: {
    forename: string;
    surname: string;
    isVulnerable: boolean;
    isIntimidated: boolean;
    isWitness: boolean;
  }[];
  defendants: {
    isDefendant: boolean;
    firstname: string;
    surname: string;
    companyName: string;
    dateOfBirth: string | null;
    gender: string;
    disability: string;
    ethnicity: string;
    religion: string;
    type: string;
    arrestDate: string | null;
    seriousDangerousOffender: boolean;
    arrestSummonsNumber: string;
    isNotYetCharged: boolean;
    aliases: {
      firstName: string;
      lastName: string;
    }[];
    charges: {
      offenceCode: string;
      offenceDescription: string;
      offenceId: string;
      dateFrom: string | null;
      dateTo: string | null;
      victimIndexId: number; //default -1 for no victim
      modeOfTrial: string;
    };
  }[];
};
