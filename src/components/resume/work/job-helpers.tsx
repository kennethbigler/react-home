import * as React from "react";
import Chip from "@mui/material/Chip";
import dateObj, { DateObj } from "../../../apis/DateHelper";
import { FORMAT } from "../../common/timeline-card/timeline-consts";

export const getCSV = (arr: string[] = []): React.ReactNode[] => {
  const style = { marginRight: 5, marginBottom: 5 };
  return arr.map((item) => <Chip key={item} label={item} style={style} />);
};

export const showRange = (s: DateObj, e: DateObj, notes = ""): string => {
  // start date
  const start = s.format(FORMAT);
  // end date, check if it is the present
  const end = dateObj().diff(e, "days") < 1 ? "Present" : e.format(FORMAT);

  // get the time range in years, months
  const mon = (e.diff(s, "months") + 1) % 12;
  const yr = e.diff(s, "years") + (mon === 0 ? 1 : 0);
  const yRange = yr ? `${yr} year${yr > 1 ? "s" : ""}` : null;
  const mRange = mon ? `${mon} month${mon > 1 ? "s" : ""}` : 0;
  const range = yRange ? yRange + (mRange ? `, ${mRange}` : "") : mRange;

  // return string for output
  return `${start} - ${end} (${range}) ${notes}`;
};
