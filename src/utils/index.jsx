import { format } from "date-fns";

export const getDuration = (startDateTime, endDateTime) => {
  if (format(startDateTime, "dmy") === format(endDateTime, "dmy")) {
    const startTime = format(startDateTime, "hh:mm a");
    const endTime = format(endDateTime, "hh:mm a");
    return `${startTime} - ${endTime}`;
  }

  const formatStartDateTime = format(startDateTime, "eee, d MMM y hh:mm a");
  const formatEndDateTime = format(endDateTime, "eee, d MMM y hh:mm a");
  return `${formatStartDateTime} - ${formatEndDateTime}`;
};

export const stringSort = (array, order) => {
  if (order === "asc") {
    return array.sort();
  }

  if (order === "desc") {
    return array.sort((a, b) => b.localeCompare(a));
  }
};
