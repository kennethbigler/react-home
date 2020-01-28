/* TODO: expand below on click */
import React from 'react';
import dateObj, { DateObj, FormatOutput } from '../../../apis/DateHelper';
import Row from './Row';
import { SegmentType } from './types';

export interface DataEntry {
  color: string;
  title: string;
  start: DateObj;
  end: DateObj;
  inverted?: boolean;
  short?: string;
}
interface TimelineProps {
  /** reads [selector] from each array entry and creates segments */
  data: DataEntry[];
  /** key to be used to read data */
  selector: string;
  /** start of the timeline */
  start: DateObj;
  /** end of the timeline */
  end: DateObj;
}

export const FORMAT: FormatOutput = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';
export const MONTH_SORT = (a: DataEntry, b: DataEntry): number => a.start.diff(b.start, 'months');

const WIDTH = 99;
const MIN_TEXT_WIDTH = 96;
const MIN_SHORT_WIDTH = 42;
const YEAR_WIDTH = 0.3;

/** function to add empty space between start and elm segment */
const addEmptySegment = (segments: SegmentType[], width: number): void => {
  if (width > 0) {
    segments.push({ width });
  }
};

const Timeline = (props: TimelineProps): React.ReactElement => {
  const {
    start, end, selector, data: propsData,
  } = props;
  // get immutable data from props and sort by start date
  const data: DataEntry[] = React.useMemo(() => [...propsData].sort(MONTH_SORT), [propsData]);
  // track elements added already
  const added: boolean[] = [];

  /** Get the width from the beginning of the graph to this bar */
  const getTimeFromStart = React.useCallback(
    (val: DateObj): number => {
      // get max length
      const totalDuration = end.diff(start, 'months');
      const timeFromStart = val.diff(start, 'months');
      const width = Math.floor((timeFromStart / totalDuration) * WIDTH);
      return width > 0 ? width : 0;
    },
    [end, start],
  );

  /** function to add elm segment */
  const addSegment = React.useCallback(
    (segments: SegmentType[], elm: any, beginning: number, ending: number): void => {
      const {
        color, inverted, title, short,
      } = elm;
      const width = ending - beginning;
      const textWidth = (width * (window.innerWidth - 64)) / WIDTH;
      const payload = {
        color, inverted, width, title,
      };
      // check if name has room
      if (textWidth < MIN_SHORT_WIDTH) {
        segments.push({
          body: elm[selector].substr(0, 1),
          ...payload,
        });
      } else if (textWidth < MIN_TEXT_WIDTH) {
        segments.push({
          body: short,
          ...payload,
        });
      } else {
        segments.push({
          body: elm[selector],
          ...payload,
        });
      }
    },
    [selector],
  );

  /** break data up into segments */
  const getSegments = React.useCallback(
    (elm: DataEntry, i: number): SegmentType[] => {
      // skip if added already
      if (added[i]) {
        return [];
      }

      // local variables
      const segments: SegmentType[] = [];
      const { start: segStart, end: segEnd } = elm;
      let beginning = getTimeFromStart(segStart);
      let ending = getTimeFromStart(segEnd);

      // add main segments
      addEmptySegment(segments, beginning);
      addSegment(segments, elm, beginning, ending);

      // track that segments have been added
      added[i] = true;

      // find any other segments that will fit
      for (let j = i + 1; j < data.length; j += 1) {
        // skip if added already
        if (!added[j]) {
          // test segment
          const { start: jStart, end: jEnd } = data[j];
          beginning = getTimeFromStart(jStart);

          // if start is after end of main segment
          if (beginning >= ending) {
            // add filler in between end/start
            addEmptySegment(segments, beginning - ending);
            // add next segment
            ending = getTimeFromStart(jEnd);
            addSegment(segments, data[j], beginning, ending);
            // mark as already added
            added[j] = true;
          }
        }
      }

      // get last segment
      addEmptySegment(segments, WIDTH - ending);

      return [...segments];
    },
    [addSegment, added, data, getTimeFromStart],
  );

  /** adds gray lines to indicate years */
  const getYearMarkers = React.useCallback(
    (): SegmentType[] => {
      const startYear = Number(start.format('YYYY'));
      const endYear = Number(end.format('YYYY'));

      const years = [];
      for (let year = startYear + 1; year <= endYear; year += 1) {
        years.push(dateObj(`${year}`));
      }

      const marker = { width: YEAR_WIDTH, body: years[0].format('\'YY') };
      const yearMarkers = [{ width: getTimeFromStart(years[0]) - YEAR_WIDTH }, marker];

      for (let i = 1; i < years.length; i += 1) {
        const previousYear = getTimeFromStart(years[i - 1]);
        const thisYear = getTimeFromStart(years[i]);
        yearMarkers.push({ width: thisYear - previousYear - YEAR_WIDTH });
        yearMarkers.push({ width: YEAR_WIDTH, body: years[i].format('\'YY') });
      }

      return yearMarkers;
    },
    [end, getTimeFromStart, start],
  );

  return (
    <div style={{ width: '100%' }}>
      <Row key={data.length} segments={getYearMarkers()} yearMarkers />
      {data.map((elm, i) => {
        const segments = getSegments(elm, i);
        return segments.length
          ? (<Row key={i} segments={segments} first={i === 0} />)
          : null;
      })}
    </div>
  );
};

export default Timeline;
