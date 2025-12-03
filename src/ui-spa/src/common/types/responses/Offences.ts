export type Offence = {
  code: string;
  description: string;
  legislation: string;
  effectiveFromDate: string;
  effectiveToDate: string | null;
};

export type Offences = Offence[];
