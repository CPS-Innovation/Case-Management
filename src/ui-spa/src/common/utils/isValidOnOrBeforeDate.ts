import { parse, isValid, startOfDay, isAfter } from "date-fns";

export const isValidOnOrBeforeDate = (
  inputDate: string,
  comparisonDate: string = new Date().toISOString().split("T")[0],
) => {
  const parsedInputDate = parse(inputDate, "yyyy-MM-dd", new Date());
  const parsedComparisonDate = parse(comparisonDate, "yyyy-MM-dd", new Date());
  if (!isValid(parsedInputDate) || !isValid(parsedComparisonDate)) return false;

  return !isAfter(
    startOfDay(parsedInputDate),
    startOfDay(parsedComparisonDate),
  );
};

// is arrestDate on or Before charge date
// is charge date on or after arrest date
// is charge date on or before first hearing date
