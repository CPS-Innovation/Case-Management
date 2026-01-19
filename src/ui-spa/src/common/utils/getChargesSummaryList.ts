import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
import { type ChargesFormData } from "../reducers/caseRegistrationReducer";

export type SuspectChargesSummary = {
  suspectId: string;
  suspectFirstNameText: string;
  suspectLastNameText: string;
  suspectCompanyNameText: string;
  charges: ChargesFormData[];
};

export const getChargesSummaryList = (
  suspects: SuspectFormData[],
): SuspectChargesSummary[] => {
  const chargeList = suspects.map((suspect) => ({
    suspectId: suspect.suspectId,
    suspectFirstNameText: suspect.suspectFirstNameText,
    suspectLastNameText: suspect.suspectLastNameText,
    suspectCompanyNameText: suspect.suspectCompanyNameText,
    charges: suspect.charges,
  }));

  return chargeList.filter((item) => item.charges.length > 0);
};
