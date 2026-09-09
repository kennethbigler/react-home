import type { DateObj } from "@/apis/DateHelper";

export const TIMELINE_WIDTH = 100;
const YEAR_MARKER_WIDTH = 0.3;

export interface TimelineRange {
  start: DateObj;
  end: DateObj;
}

/** Proportional position on the timeline in [0, TIMELINE_WIDTH]. */
export const positionOnTimeline = (
  date: DateObj,
  range: TimelineRange,
): number => {
  const totalMonths = range.end.diff(range.start, "months");
  if (totalMonths <= 0) {
    return 0;
  }

  const months = date.diff(range.start, "months");
  const position = (months / totalMonths) * TIMELINE_WIDTH;
  return Math.min(TIMELINE_WIDTH, Math.max(0, position));
};

/** Width between two dates; never negative. */
export const widthBetween = (
  from: DateObj,
  to: DateObj,
  range: TimelineRange,
): number =>
  Math.max(0, positionOnTimeline(to, range) - positionOnTimeline(from, range));

/** Width between two already-computed positions; never negative. */
export const gapBetweenPositions = (from: number, to: number): number =>
  Math.max(0, to - from);

/**
 * Adjust the last width so a row sums to exactly TIMELINE_WIDTH.
 * Absorbs floating-point drift from proportional math.
 */
export const finalizeRowWidths = (widths: number[]): number[] => {
  if (widths.length === 0) {
    return widths;
  }

  const rounded = widths.map((width) => Math.round(width * 10000) / 10000);
  let diff =
    TIMELINE_WIDTH - rounded.reduce((total, width) => total + width, 0);

  for (let index = rounded.length - 1; diff !== 0 && index >= 0; index -= 1) {
    const next = rounded[index] + diff;
    if (next >= 0) {
      rounded[index] = next;
      diff = 0;
    } else {
      diff = next;
      rounded[index] = 0;
    }
  }

  return rounded;
};

export interface YearMarkerInput {
  date: DateObj;
  label: string;
  color?: string;
}

export interface TimelineMarkerSegment {
  width: number;
  body?: string;
  color?: string;
}

const pushGap = (segments: TimelineMarkerSegment[], width: number): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

/**
 * Build alternating gap + marker segments for a year axis.
 * Each marker's tick aligns with `date`; the row spans TIMELINE_WIDTH exactly.
 */
export const buildYearMarkerSegments = (
  range: TimelineRange,
  markers: YearMarkerInput[],
): TimelineMarkerSegment[] => {
  if (markers.length === 0) {
    return [];
  }

  const positions = markers.map(({ date }) => positionOnTimeline(date, range));
  const segments: TimelineMarkerSegment[] = [];

  pushGap(segments, gapBetweenPositions(0, positions[0] - YEAR_MARKER_WIDTH));

  markers.forEach((marker, index) => {
    segments.push({
      width: YEAR_MARKER_WIDTH,
      body: marker.label,
      color: marker.color,
    });

    const nextGapEnd =
      index < positions.length - 1
        ? positions[index + 1] - YEAR_MARKER_WIDTH
        : TIMELINE_WIDTH;

    pushGap(segments, gapBetweenPositions(positions[index], nextGapEnd));
  });

  const finalizedWidths = finalizeRowWidths(segments.map(({ width }) => width));
  return segments.map((segment, index) => ({
    ...segment,
    width: finalizedWidths[index],
  }));
};
