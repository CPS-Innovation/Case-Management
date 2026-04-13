import { offenderTypeShortCodes } from "../constants/offenderTypeShortCodes";
export const isChargedWithAdultWarningActive = (
  offenderTypeShortCode: string,
): boolean => {
  if (
    offenderTypeShortCode === offenderTypeShortCodes.PROLIFIC_YOUTH_OFFENDER ||
    offenderTypeShortCode === offenderTypeShortCodes.YOUTH_OFFENDER
  ) {
    return true;
  }
  return false;
};
