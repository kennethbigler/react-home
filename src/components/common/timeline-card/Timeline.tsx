/* TODO: expand below on click */
import React, { Component } from 'react';
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
  data: DataEntry[];
  selector: string;
  start: DateObj;
  end: DateObj;
}
interface TimelineState {
  data: DataEntry[];
}

export const FORMAT: FormatOutput = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';
export const MONTH_SORT = (a: DataEntry, b: DataEntry): number => a.start.diff(b.start, 'months');

const WIDTH = 100;
const MIN_TEXT_WIDTH = 96;
const MIN_SHORT_WIDTH = 42;

export class Timeline extends Component<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props);
    // get immutable data from props and sort by start date
    const data = [...props.data];
    data.sort(MONTH_SORT);
    this.state = { data };
  }

  /** Get the width from the beginning of the graph to this bar */
  getTimeFromStart = (val: DateObj): number => {
    // sort array by start date
    const { start, end } = this.props;
    // get max length
    const totalDuration = end.diff(start, 'months');
    const timeFromStart = val.diff(start, 'months');
    const width = Math.floor((timeFromStart / totalDuration) * WIDTH);
    return width > 0 ? width : 0;
  };

  /** function to add elm segment */
  addSegment = (segments: SegmentType[], elm: any, beginning: number, ending: number): void => {
    const { selector } = this.props;
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
  };

  getSegments = (added: boolean[], elm: DataEntry, i: number): SegmentType[] => {
    const { data } = this.state;

    // skip if added already
    if (added[i]) {
      return [];
    }

    // local variables
    const segments: SegmentType[] = [];
    const { start, end } = elm;
    let beginning = this.getTimeFromStart(start);
    let ending = this.getTimeFromStart(end);

    // add main segments
    this.addEmptySegment(segments, beginning);
    this.addSegment(segments, elm, beginning, ending);

    // track that segments have been added
    added[i] = true;

    // find any other segments that will fit
    for (let j = i + 1; j < data.length; j += 1) {
      // skip if added already
      if (!added[j]) {
        // test segment
        const { start: jStart, end: jEnd } = data[j];
        beginning = this.getTimeFromStart(jStart);

        // if start is after end of main segment
        if (beginning >= ending) {
          // add filler in between end/start
          this.addEmptySegment(segments, beginning - ending);
          // add next segment
          ending = this.getTimeFromStart(jEnd);
          this.addSegment(segments, data[j], beginning, ending);
          // mark as already added
          added[j] = true;
        }
      }
    }

    // get last segment
    this.addEmptySegment(segments, WIDTH - ending);

    return [...segments];
  };

  /** function to add empty space between start and elm segment */
  addEmptySegment = (segments: SegmentType[], width: number): void => {
    if (width > 0) {
      segments.push({ width });
    }
  };

  getYearMarkers = (): SegmentType[] => {
    const { start, end } = this.props;

    const startYear = parseInt(start.format('YYYY'), 10);
    const endYear = parseInt(end.format('YYYY'), 10);

    const years = [];
    for (let year = startYear + 1; year <= endYear; year += 1) {
      years.push(dateObj(`${year}-01`));
    }

    const width = 0.1;
    const marker = { width, body: years[0].format('\'YY') };
    const yearMarkers = [{ width: this.getTimeFromStart(years[0]) - width }, marker];

    for (let i = 1; i < years.length; i += 1) {
      const lastYear = this.getTimeFromStart(years[i - 1]);
      const thisYear = this.getTimeFromStart(years[i]);
      yearMarkers.push({ width: thisYear - lastYear - width });
      yearMarkers.push({ width, body: years[i].format('\'YY') });
    }

    return yearMarkers;
  }

  render(): React.ReactNode {
    const { data } = this.state;
    // track elements added already
    const added: boolean[] = [];

    return (
      <div style={{ width: '100%' }}>
        <Row key={data.length} segments={this.getYearMarkers()} yearMarkers />
        {data.map((elm, i) => {
          const segments = this.getSegments(added, elm, i);
          return segments.length
            ? (<Row key={i} segments={segments} first={i === 0} />)
            : null;
        })}
      </div>
    );
  }
}

export default Timeline;
