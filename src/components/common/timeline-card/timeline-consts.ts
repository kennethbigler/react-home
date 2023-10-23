import { DateObj, FormatOutput } from "../../../apis/DateHelper";

export interface DataEntry {
  color: string;
  title: string;
  start: DateObj;
  end: DateObj;
  inverted?: boolean;
  short?: string;
  char?: string;
  [prop: string]: string | string[] | DateObj | boolean | number | undefined;
}

export const FORMAT: FormatOutput = "MMMM Y";
export const TIMELINE_TITLE = "Timeline";
export const MONTH_SORT = (a: DataEntry, b: DataEntry): number =>
  a.start.diff(b.start, "months");
