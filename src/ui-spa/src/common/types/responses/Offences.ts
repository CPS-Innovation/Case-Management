export type Offence = {
  code: string;
  description: string;
  legislation: string;
  effectiveFromDate: string;
  effectiveToDate: string | null;
  modeOfTrial: string;
};

export type Offences = { offences: Offence[]; total: number };
