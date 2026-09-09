import dateObj, { type DateObj } from "@/apis/DateHelper";
import type { ContractData } from "@/constants/f1";
import type { SegmentType } from "@/components/common/timeline-parts/Segment";
import {
  TIMELINE_WIDTH,
  buildYearMarkerSegments,
  finalizeRowWidths,
  gapBetweenPositions,
  positionOnTimeline,
  type TimelineRange,
} from "@/components/common/timeline-parts/timelineMath";

/* *************************     Constants     ************************* */
const YEAR_MARK_FREQ = 2;

export type { TimelineRange };

export interface TimelineRow {
  key: string;
  segments: SegmentType[];
}

/* *************************     Local Functions     ************************* */
const pushGap = (segments: SegmentType[], width: number): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

const addSegment = (
  segments: SegmentType[],
  elm: ContractData,
  width: number,
): void => {
  const { color, inverted, team } = elm;
  segments.push({ body: team, color, inverted, width, title: team });
};

/** One calendar month after a DateObj (December rolls into January) */
const addMonth = (date: DateObj): DateObj => {
  const next = date.month + 1;
  const year = date.year + Math.floor(next / 12);
  const month = (next % 12) + 1;
  return dateObj(`${year}-${String(month).padStart(2, "0")}`);
};

/* *************************     Export Functions     ************************* */
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
  const years: DateObj[] = [];
  for (let year = startYear + 1; year <= endYear; year += YEAR_MARK_FREQ) {
    if (year === currentYear) {
      hasCurrentYear = true;
    } else if (year > currentYear && !hasCurrentYear) {
      years.push(dateObj(`${currentYear}`));
      hasCurrentYear = true;
    }
    years.push(dateObj(`${year}`));
  }

  const markers = years.map((yearDate) => ({
    date: yearDate,
    label: yearDate.format("'YY"),
    color: yearDate.year === currentYear ? currentYearColor : undefined,
  }));

  return buildYearMarkerSegments(range, markers);
};

/** break data up into segments */
const getSegments = (
  data: ContractData[],
  added: Set<number>,
  elm: ContractData,
  i: number,
  range: TimelineRange,
): SegmentType[] => {
  if (added.has(i)) {
    return [];
  }

  const segments: SegmentType[] = [];

  let beginning = positionOnTimeline(elm.start, range);
  let ending = positionOnTimeline(elm.end, range);

  pushGap(segments, beginning);
  addSegment(segments, elm, gapBetweenPositions(beginning, ending));
  added.add(i);

  data.forEach((entry, j) => {
    if (!added.has(j)) {
      beginning = positionOnTimeline(entry.start, range);
      if (beginning >= ending) {
        pushGap(segments, gapBetweenPositions(ending, beginning));
        ending = positionOnTimeline(entry.end, range);
        addSegment(segments, entry, gapBetweenPositions(beginning, ending));
        added.add(j);
      }
    }
  });

  pushGap(segments, gapBetweenPositions(ending, TIMELINE_WIDTH));

  const finalizedWidths = finalizeRowWidths(segments.map(({ width }) => width));
  return segments.map((segment, index) => ({
    ...segment,
    width: finalizedWidths[index],
  }));
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
