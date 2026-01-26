import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
import { getChargesSummaryList } from "./getChargesSummaryList";
import { isValidOnOrBeforeDate } from "./isValidOnOrBeforeDate";
import { isValidOnOrAfterDate } from "./isValidOnOrAfterDate";

export const getChargeDates = (suspects: SuspectFormData[]) => {
  const chargesList = getChargesSummaryList(suspects);
  if (chargesList.length === 0) return [];

  const charges = chargesList.reduce((acc, item) => {
    item.charges.every((charge) => {
      if (charge.offenceFromDate) acc.push(charge.offenceFromDate);
      if (charge.offenceToDate) acc.push(charge.offenceToDate);
    });

    return acc;
  }, [] as string[]);

  return charges;
};

export const isOnOrBeforeChargeDates = (
  inputDate: string,
  suspects: SuspectFormData[],
) => {
  const charges = getChargeDates(suspects);
  const invalid = charges.find(
    (charge) => !isValidOnOrBeforeDate(inputDate, charge),
  );
  return !invalid;
};

export const isOnOrAfterChargeDates = (
  inputDate: string,
  suspects: SuspectFormData[],
) => {
  const charges = getChargeDates(suspects);
  const invalid = charges.find(
    (charge) => !isValidOnOrAfterDate(inputDate, charge),
  );
  return !invalid;
};
