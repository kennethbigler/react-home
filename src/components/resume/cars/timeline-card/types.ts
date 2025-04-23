import { DateObj } from "../../../../apis/DateHelper";

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

export interface SegmentType {
  color?: string;
  body?: string;
  title?: string;
  width: number;
  inverted?: boolean;
}
