import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import dateHelper from "../../../../apis/DateHelper";

/** Selectable entry years, newest first (2000 through the current year). */
export const entryYears: number[] = [];
for (let year = new Date().getFullYear(); year >= 2000; year -= 1) {
  entryYears.push(year);
}

/**
 * Month/year Select state for entry dialogs, seeded from an optional
 * YYYY-MM date. `onChange` fires after either field updates.
 */
const useMonthYear = (initialEntryDate?: string, onChange?: () => void) => {
  const [month, setMonth] = useState(() =>
    initialEntryDate
      ? (dateHelper(initialEntryDate).month + 1).toString()
      : "1",
  );
  const [year, setYear] = useState(() =>
    initialEntryDate
      ? dateHelper(initialEntryDate).year.toString()
      : entryYears[0].toString(),
  );

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setMonth(event.target.value);
    onChange?.();
  };
  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
    onChange?.();
  };

  return {
    month,
    year,
    /** YYYY-MM built from the current month/year selection. */
    entryDate: `${year}-${month.padStart(2, "0")}`,
    handleMonthChange,
    handleYearChange,
  };
};

export default useMonthYear;
