import dateObj, { DateObj } from "../../../../apis/DateHelper";
import { DataEntry, SegmentType } from "./types";

export const START = dateObj("2008-03");
export const END = dateObj();
export const WIDTH = 99;
const MIN_TEXT_WIDTH = 85;
const MIN_SHORT_WIDTH = 54;
const YEAR_WIDTH = 0.3;
const SELECTOR = "car";
const YEAR_MARK_FREQ = 3;

export const monthSort = (a: DataEntry, b: DataEntry): number =>
  a.start.diff(b.start, "months");

/** function to add empty space between start and elm segment */
export const addEmptySegment = (
  segments: SegmentType[],
  width: number,
): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

/** Get the width from the beginning of the graph to this bar */
export const getTimeFromStart = (val: DateObj): number => {
  // get max length
  const totalDuration = END.diff(START, "months");
  const timeFromStart = val.diff(START, "months");
  const width = Math.floor((timeFromStart / totalDuration) * WIDTH);
  return width > 0 ? width : 0;
};

/** adds gray lines to indicate years */
export const getYearMarkers = () => {
  const startYear = Number(START.format("YYYY"));
  const endYear = Number(END.format("YYYY"));

  const years = [];
  for (let year = startYear + 1; year <= endYear; year += YEAR_MARK_FREQ) {
    years.push(dateObj(`${year}`));
  }

  const marker = { width: YEAR_WIDTH, body: years[0].format("'YY") };
  const yearMarkers = [
    { width: getTimeFromStart(years[0]) - YEAR_WIDTH },
    marker,
  ];

  for (let i = 1; i < years.length; i += 1) {
    const previousYear = getTimeFromStart(years[i - 1]);
    const thisYear = getTimeFromStart(years[i]);
    yearMarkers.push({ width: thisYear - previousYear - YEAR_WIDTH });
    yearMarkers.push({ width: YEAR_WIDTH, body: years[i].format("'YY") });
  }

  return yearMarkers;
};

/** function to add elm segment */
export const addSegment = (
  segments: SegmentType[],
  elm: DataEntry,
  beginning: number,
  ending: number,
): void => {
  const { color, inverted, title, short, char } = elm;
  const width = ending - beginning;
  const textWidth = (width * (window.innerWidth - 64)) / WIDTH;
  const payload = {
    color,
    inverted,
    width,
    title,
  };
  // check if name has room
  if (textWidth < MIN_SHORT_WIDTH) {
    segments.push({
      body: char || (elm[SELECTOR] as string).substr(0, 1),
      ...payload,
    });
  } else if (textWidth < MIN_TEXT_WIDTH) {
    segments.push({
      body: short,
      ...payload,
    });
  } else {
    segments.push({
      body: elm[SELECTOR] as string,
      ...payload,
    });
  }
};
