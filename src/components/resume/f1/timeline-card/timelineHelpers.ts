import dateObj, { DateObj } from "../../../../apis/DateHelper";
import { ContractData } from "../../../../constants/f1";
import { SegmentType } from "../../../common/timeline-parts/Segment";

/* *************************     Constants     ************************* */
export const START = dateObj("2012");
export const END = dateObj("2030");

const WIDTH = 99;
const MIN_TEXT_WIDTH = 86;
const MIN_SHORT_WIDTH = 56;
const YEAR_WIDTH = 0.3;
const YEAR_MARK_FREQ = 2;

interface YearMarkerType {
  width: number;
  body?: string;
  color?: string;
}

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
  elm: ContractData,
  beginning: number,
  ending: number,
): void => {
  const { color, inverted, team } = elm;
  const width = ending - beginning;
  const textWidth = (width * (window.innerWidth - 64)) / WIDTH;
  const payload = { color, inverted, width };
  // check if name has room
  if (textWidth < MIN_SHORT_WIDTH) {
    segments.push({ body: elm.team[0], ...payload });
  } else if (textWidth < MIN_TEXT_WIDTH) {
    segments.push({ body: team.substring(0, 5), ...payload });
  } else {
    segments.push({ body: elm.team, ...payload });
  }
};

/* *************************     Export Functions     ************************* */
/** adds gray lines to indicate years */
export const getYearMarkers = () => {
  const startYear = Number(START.format("YYYY"));
  const endYear = Number(END.format("YYYY"));

  const currentYear = dateObj().year;
  let hasCurrentYear = false;
  const years = [];
  for (let year = startYear + 1; year <= endYear; year += YEAR_MARK_FREQ) {
    if (year === currentYear) {
      hasCurrentYear = true;
    } else if (year > currentYear && !hasCurrentYear) {
      years.push(dateObj(`${currentYear}`));
      hasCurrentYear = true;
    }
    years.push(dateObj(`${year}`));
  }

  const marker = { width: YEAR_WIDTH, body: years[0].format("'YY") };
  const yearMarkers: YearMarkerType[] = [
    { width: getTimeFromStart(years[0]) - YEAR_WIDTH },
    marker,
  ];

  for (let i = 1; i < years.length; i += 1) {
    const previousYear = getTimeFromStart(years[i - 1]);
    const thisYear = getTimeFromStart(years[i]);
    yearMarkers.push({ width: thisYear - previousYear - YEAR_WIDTH });
    yearMarkers.push({
      width: YEAR_WIDTH,
      body: years[i].format("'YY"),
      color: years[i].year === currentYear ? "red" : undefined,
    });
  }

  return yearMarkers;
};

/** break data up into segments */
export const getSegments = (
  data: ContractData[],
  added: boolean[],
  elm: ContractData,
  i: number,
): SegmentType[] => {
  // skip if added already
  if (added[i]) {
    return [];
  }

  // local variables
  const segments: SegmentType[] = [];

  let beginning = getTimeFromStart(elm.start);
  let ending = getTimeFromStart(elm.end);

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
      beginning = getTimeFromStart(entry.start);
      // if start is after end of main segment
      if (beginning >= ending) {
        // add filler in between end/start
        addEmptySegment(segments, beginning - ending);
        // add next segment
        ending = getTimeFromStart(entry.end);
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
