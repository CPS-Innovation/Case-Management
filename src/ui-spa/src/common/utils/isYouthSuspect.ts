import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
export const isYouthSuspect = (suspect: SuspectFormData): boolean => {
  if (
    suspect.suspectOffenderTypesRadio.shortCode === "PYO" ||
    suspect.suspectOffenderTypesRadio.shortCode === "PPO & PYO" ||
    suspect.suspectOffenderTypesRadio.shortCode === "YO"
  ) {
    return true;
  }

  const suspectDateOfBirth = `${suspect.suspectDOBDayText}/${suspect.suspectDOBMonthText}/${suspect.suspectDOBYearText}`;

  return isUnder18(suspectDateOfBirth);
};

export const isUnder18 = (dob: string): boolean => {
  const today = new Date();
  const birthDate = new Date(dob);
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
