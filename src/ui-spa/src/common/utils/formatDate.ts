import { parseISO, isValid, isToday } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const formatDate = (
  dateString: string | null | undefined,
  withTime: boolean = false,
  format: "dd/MM/yyyy" | "dd MMM yyyy" = "dd/MM/yyyy",
) => {
  if (!dateString) {
    return "--";
  }
  const date = parseISO(dateString);

  if (!isValid(date)) {
    return "--";
  }
  const formattedTime = formatInTimeZone(date, "Europe/London", format);
  if (!withTime) {
    return isToday(date) ? "Today" : formattedTime;
  }
  const timeString = formatInTimeZone(date, "Europe/London", "h:mm aaa");
  return isToday(date)
    ? `Today, ${timeString}`
    : `${formattedTime}, ${timeString}`;
};
