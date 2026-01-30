import { parse, isValid, startOfDay, isBefore } from "date-fns";

export const isValidOnOrAfterDate = (
  inputDate: string,
  comparisonDate: string = new Date().toISOString().split("T")[0],
) => {
  const parsedInputDate = parse(inputDate, "yyyy-MM-dd", new Date());
  const parsedComparisonDate = parse(comparisonDate, "yyyy-MM-dd", new Date());
  if (!isValid(parsedInputDate) || !isValid(parsedComparisonDate)) return false;

  return !isBefore(
    startOfDay(parsedInputDate),
    startOfDay(parsedComparisonDate),
  );
};
