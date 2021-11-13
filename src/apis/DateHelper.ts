const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type DateScale =
  | "year"
  | "years"
  | "month"
  | "months"
  | "days"
  | undefined;
export type FormatOutput = "YYYY" | "MMMM Y" | "'YY";
export interface DateObj {
  year: number;
  month: number;
  day: number;
  diff: (dateObj: DateObj, scale: DateScale) => number;
  format: (output: FormatOutput) => string;
}

/** Takes format YYYY-MM-DD and creates a DateObj */
const dateHelper = (date?: DateObj | string): DateObj => {
  let year: number;
  let month: number;
  let day: number;

  if (typeof date === "object") {
    return date;
  }
  if (typeof date === "string") {
    const [y, m, d] = date.split("-");
    year = Number(y);
    month = Number(m) - 1 || 0;
    day = Number(d) || 1;
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth();
    day = now.getDate();
  }

  const diff = (dateObj: DateObj, scale: DateScale = "days"): number => {
    switch (scale) {
      case "year":
      case "years":
        return year - dateObj.year;
      case "month":
      case "months":
        return 12 * (year - dateObj.year) + (month - dateObj.month);
      default:
        return (
          365 * (year - dateObj.year) +
          30 * (month - dateObj.month) +
          (day - dateObj.day)
        );
    }
  };

  const format = (output: FormatOutput): string => {
    switch (output) {
      case "YYYY":
        return year.toString();
      case "MMMM Y":
        return `${months[month]} ${year}`;
      case "'YY":
        return `'${year.toString().slice(-2)}`;
      default:
        // eslint-disable-next-line no-console
        console.error("unknown date format: ", output);
        return "";
    }
  };

  return {
    year,
    month,
    day,
    diff,
    format,
  };
};

export default dateHelper;
