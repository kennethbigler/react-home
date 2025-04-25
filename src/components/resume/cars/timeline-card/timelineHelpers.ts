import dateObj, { DateObj } from "../../../../apis/DateHelper";
import { CarEntry } from "../../../../constants/cars";

/* *************************     Types     ************************* */
export interface SegmentType {
  color?: string;
  body?: string;
  title?: string;
  width: number;
  inverted?: boolean;
}

/* *************************     Constants     ************************* */
export const START = dateObj("2008-03");
export const END = dateObj();

const WIDTH = 99;
const MIN_TEXT_WIDTH = 85;
const MIN_SHORT_WIDTH = 54;
const YEAR_WIDTH = 0.3;
const YEAR_MARK_FREQ = 3;

/* *************************     Local Functions     ************************* */
/** function to add empty space between start and elm segment */
const addEmptySegment = (segments: SegmentType[], width: number): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

/** Get the width from the beginning of the graph to this bar */
const getTimeFromStart = (val: DateObj): number => {
  // get max length
  const totalDuration = END.diff(START, "months");
  const timeFromStart = val.diff(START, "months");
  const width = Math.floor((timeFromStart / totalDuration) * WIDTH);
  return width > 0 ? width : 0;
};

/** function to add elm segment */
const addSegment = (
  segments: SegmentType[],
  elm: CarEntry,
  beginning: number,
  ending: number,
): void => {
  const { color, inverted, title, short, char } = elm;
  const width = ending - beginning;
  const textWidth = (width * (window.innerWidth - 64)) / WIDTH;
  const payload = { color, inverted, width, title };
  // check if name has room
  if (textWidth < MIN_SHORT_WIDTH) {
    segments.push({ body: char || elm.car[0], ...payload });
  } else if (textWidth < MIN_TEXT_WIDTH) {
    segments.push({ body: short, ...payload });
  } else {
    segments.push({ body: elm.car, ...payload });
  }
};

/* *************************     Export Functions     ************************* */
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

const getStart = (data: CarEntry, useKStart: boolean, useFStart: boolean) =>
  useFStart
    ? data.fStart || data.start
    : useKStart
      ? data.kStart || data.start
      : data.start;
const getEnd = (data: CarEntry, useKStart: boolean, useFStart: boolean) =>
  useFStart
    ? data.kStart || data.end
    : useKStart
      ? data.fStart || data.end
      : data.end;

/** break data up into segments */
export const getSegments = (
  data: CarEntry[],
  added: boolean[],
  useKStart: boolean,
  useFStart: boolean,
  elm: CarEntry,
  i: number,
): SegmentType[] => {
  // skip if added already
  if (added[i]) {
    return [];
  }

  // local variables
  const segments: SegmentType[] = [];
  const segStart: DateObj = getStart(elm, useKStart, useFStart);
  const segEnd: DateObj = getEnd(elm, useKStart, useFStart);

  let beginning = getTimeFromStart(segStart);
  let ending = getTimeFromStart(segEnd);

  // add main segments
  addEmptySegment(segments, beginning);
  addSegment(segments, elm, beginning, ending);
  // track that segments have been added
  added[i] = true;

  // find any other segments that will fit
  data.forEach((entry, j) => {
    // skip if added already
    if (!added[j]) {
      // test segment
      beginning = getTimeFromStart(getStart(entry, useKStart, useFStart));
      // if start is after end of main segment
      if (beginning >= ending) {
        // add filler in between end/start
        addEmptySegment(segments, beginning - ending);
        // add next segment
        ending = getTimeFromStart(getEnd(entry, useKStart, useFStart));
        addSegment(segments, entry, beginning, ending);
        // mark as already added
        added[j] = true;
      }
    }
  });

  // get last segment
  addEmptySegment(segments, WIDTH - ending);

  return [...segments];
};
