import dateObj, { type DateObj } from "../../../../apis/DateHelper";
import type { ContractData } from "../../../../constants/f1";
import type { SegmentType } from "../../../common/timeline-parts/Segment";

/* *************************     Constants     ************************* */
const WIDTH = 99;
const YEAR_WIDTH = 0.3;
const YEAR_MARK_FREQ = 2;

interface YearMarkerType {
  width: number;
  body?: string;
  color?: string;
}

export interface TimelineRange {
  start: DateObj;
  end: DateObj;
}

export interface TimelineRow {
  key: string;
  segments: SegmentType[];
}

/* *************************     Local Functions     ************************* */
/** function to add empty space between start and elm segment */
const addEmptySegment = (segments: SegmentType[], width: number): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

/** Get the width from the beginning of the graph to this bar */
const getTimeFromStart = (val: DateObj, range: TimelineRange): number => {
  const totalDuration = range.end.diff(range.start, "months");
  const timeFromStart = val.diff(range.start, "months");
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
  segments.push({ body: team, color, inverted, width, title: team });
};

/* *************************     Export Functions     ************************* */
/** One calendar month after a DateObj (December rolls into January) */
const addMonth = (date: DateObj): DateObj => {
  const next = date.month + 1;
  const year = date.year + Math.floor(next / 12);
  const month = (next % 12) + 1;
  return dateObj(`${year}-${String(month).padStart(2, "0")}`);
};

/** Earliest start; end is one month after the latest contract, or today if later */
export const getTimelineRange = (
  data: ContractData[],
): TimelineRange | undefined => {
  if (data.length === 0) {
    return undefined;
  }

  const range = data.reduce<TimelineRange>(
    (acc, { start, end }) => ({
      start: start.diff(acc.start, "months") < 0 ? start : acc.start,
      end: end.diff(acc.end, "months") > 0 ? end : acc.end,
    }),
    { start: data[0].start, end: data[0].end },
  );

  const paddedEnd = addMonth(range.end);
  const today = dateObj();
  return {
    start: range.start,
    end: today.diff(paddedEnd, "months") > 0 ? today : paddedEnd,
  };
};

/**
 * Gray year markers on the timeline; highlights the current year when given.
 * @param currentYearColor e.g. `theme.palette.error.main` — plain helpers cannot read MUI theme.
 */
export const getYearMarkers = (
  range: TimelineRange,
  currentYearColor?: string,
) => {
  const startYear = Number(range.start.format("YYYY"));
  const endYear = Number(range.end.format("YYYY"));

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

  if (years.length === 0) {
    return [];
  }

  const marker = { width: YEAR_WIDTH, body: years[0].format("'YY") };
  const yearMarkers: YearMarkerType[] = [
    { width: getTimeFromStart(years[0], range) - YEAR_WIDTH },
    marker,
  ];

  for (let i = 1; i < years.length; i += 1) {
    const previousYear = getTimeFromStart(years[i - 1], range);
    const thisYear = getTimeFromStart(years[i], range);
    yearMarkers.push({ width: thisYear - previousYear - YEAR_WIDTH });
    yearMarkers.push({
      width: YEAR_WIDTH,
      body: years[i].format("'YY"),
      color: years[i].year === currentYear ? currentYearColor : undefined,
    });
  }

  return yearMarkers;
};

/** break data up into segments */
const getSegments = (
  data: ContractData[],
  added: Set<number>,
  elm: ContractData,
  i: number,
  range: TimelineRange,
): SegmentType[] => {
  // skip if added already
  if (added.has(i)) {
    return [];
  }

  // local variables
  const segments: SegmentType[] = [];

  let beginning = getTimeFromStart(elm.start, range);
  let ending = getTimeFromStart(elm.end, range);

  // add main segments
  addEmptySegment(segments, beginning);
  addSegment(segments, elm, beginning, ending);
  // track that segments have been added
  added.add(i);

  // find any other segments that will fit
  data.forEach((entry, j) => {
    // skip if added already
    if (!added.has(j)) {
      // test segment
      beginning = getTimeFromStart(entry.start, range);
      // if start is after end of main segment
      if (beginning >= ending) {
        // add filler in between end/start
        addEmptySegment(segments, beginning - ending);
        // add next segment
        ending = getTimeFromStart(entry.end, range);
        addSegment(segments, entry, beginning, ending);
        // mark as already added
        added.add(j);
      }
    }
  });

  // get last segment
  addEmptySegment(segments, WIDTH - ending);

  return [...segments];
};

/** Pack contracts into rows so non-overlapping spans share a line */
export const getTimelineRows = (
  data: ContractData[],
  range: TimelineRange,
): TimelineRow[] => {
  const added = new Set<number>();
  const rows: TimelineRow[] = [];

  data.forEach((elm, i) => {
    const segments = getSegments(data, added, elm, i, range);
    if (segments.length) {
      rows.push({ key: `${i}-${elm.team}`, segments });
    }
  });

  return rows;
};
