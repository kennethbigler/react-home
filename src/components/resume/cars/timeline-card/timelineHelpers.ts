import dateObj, { type DateObj } from "@/apis/DateHelper";
import type { CarEntry } from "@/constants/cars";
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
export const START = dateObj("2008-03");
const YEAR_MARK_FREQ = 3;

export const getCarsTimelineRange = (): TimelineRange => ({
  start: START,
  end: dateObj(),
});

/* *************************     Local Functions     ************************* */
const pushGap = (segments: SegmentType[], width: number): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

const addSegment = (
  segments: SegmentType[],
  elm: CarEntry,
  width: number,
): void => {
  const { color, inverted, title, car } = elm;
  segments.push({ body: car, color, inverted, width, title });
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

/* *************************     Export Functions     ************************* */
/** adds gray lines to indicate years */
export const getYearMarkers = (
  range: TimelineRange = getCarsTimelineRange(),
) => {
  const startYear = Number(range.start.format("YYYY"));
  const endYear = Number(range.end.format("YYYY"));

  const markers = [];
  for (let year = startYear + 1; year <= endYear; year += YEAR_MARK_FREQ) {
    markers.push({
      date: dateObj(`${year}`),
      label: dateObj(`${year}`).format("'YY"),
    });
  }

  return buildYearMarkerSegments(range, markers);
};

/** break data up into segments */
export const getSegments = (
  data: CarEntry[],
  added: boolean[],
  useKStart: boolean,
  useFStart: boolean,
  elm: CarEntry,
  i: number,
  range: TimelineRange = getCarsTimelineRange(),
): SegmentType[] => {
  if (added[i]) {
    return [];
  }

  const segments: SegmentType[] = [];
  const segStart: DateObj = getStart(elm, useKStart, useFStart);
  const segEnd: DateObj = getEnd(elm, useKStart, useFStart);

  let beginning = positionOnTimeline(segStart, range);
  let ending = positionOnTimeline(segEnd, range);

  pushGap(segments, beginning);
  addSegment(segments, elm, gapBetweenPositions(beginning, ending));
  added[i] = true;

  data.forEach((entry, j) => {
    if (!added[j]) {
      beginning = positionOnTimeline(
        getStart(entry, useKStart, useFStart),
        range,
      );
      if (beginning >= ending) {
        pushGap(segments, gapBetweenPositions(ending, beginning));
        ending = positionOnTimeline(getEnd(entry, useKStart, useFStart), range);
        addSegment(segments, entry, gapBetweenPositions(beginning, ending));
        added[j] = true;
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
