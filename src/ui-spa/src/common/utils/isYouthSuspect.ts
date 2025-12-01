import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
import { offenderTypeShortCodes } from "../constants/offenderTypeShortCodes";
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
  const today = new Date();
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age < 18;
};
