import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
import { offenderTypeShortCodes } from "../constants/offenderTypeShortCodes";
import { getCurrentAge } from "./getCurrentAge";
export const isYouthSuspect = (suspect: SuspectFormData): boolean => {
  if (
    suspect.suspectOffenderTypesRadio.shortCode ===
      offenderTypeShortCodes.PROLIFIC_YOUTH_OFFENDER ||
    suspect.suspectOffenderTypesRadio.shortCode ===
      offenderTypeShortCodes.BOTH_OFFENDER_TYPES ||
    suspect.suspectOffenderTypesRadio.shortCode ===
      offenderTypeShortCodes.YOUTH_OFFENDER
  ) {
    return true;
  }

  const suspectDateOfBirth = `${suspect.suspectDOBDayText}/${suspect.suspectDOBMonthText}/${suspect.suspectDOBYearText}`;

  return isUnder18(suspectDateOfBirth);
};

export const isUnder18 = (dob: string): boolean => {
  const age = getCurrentAge(dob);
  if (!age) {
    return false;
  }
  return age < 18;
};
