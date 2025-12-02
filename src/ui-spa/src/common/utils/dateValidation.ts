import { getCurrentAge } from "./getCurrentAge";
import { dobValidationConstants } from "../constants/dobValidationConstants";
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const isLeapYear = (year: number): boolean => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const validateDate = (
  day: number,
  month: number,
  year: number,
): ValidationResult => {
  const errors = [];

  if (year < 1000 || year > 9999) {
    errors.push(dobValidationConstants.INVALID_YEAR);
  }

  if (month < 1 || month > 12) {
    errors.push(dobValidationConstants.INVALID_MONTH);
  }
  const daysInMonth: number[] = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];
  if (month === 2 && isLeapYear(year)) {
    daysInMonth[1] = 29;
  }

  if (day < 1 || day > daysInMonth[month - 1] || day > 31) {
    errors.push(dobValidationConstants.INVALID_DAY);
  }

  if (!errors.length) {
    const age = getCurrentAge(`${year}-${month}-${day}`);

    if (!age && age !== 0) {
      errors.push(dobValidationConstants.INVALID_DATE);
    } else if (age < 10 || age > 120) {
      errors.push(dobValidationConstants.INVALID_AGE);
    }
  }

  return { isValid: !errors.length, errors: errors };
};
