import React, { Component } from 'react';
import types from 'prop-types';
import moment from 'moment';
import map from 'lodash/map';
import Row from './Row';
// Parents: Work

export const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';
export const MONTH_SORT = (a, b) => a.start.diff(b.start, 'months');

const WIDTH = 100;
const MIN_TEXT_WIDTH = 96;
const MIN_SHORT_WIDTH = 42;

export class Timeline extends Component {
  static propTypes = {
    data: types.arrayOf(
      types.shape({
        color: types.string.isRequired,
        title: types.string.isRequired,
        start: types.shape({
          diff: types.func.isRequired,
        }).isRequired,
        end: types.shape({
          diff: types.func.isRequired,
        }).isRequired,
      }),
    ).isRequired,
    selector: types.string.isRequired,
    start: types.shape({
      diff: types.func.isRequired,
      format: types.func.isRequired,
    }).isRequired,
    end: types.shape({
      diff: types.func.isRequired,
      format: types.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    // get immutable data from props and sort by start date
    const data = [...props.data];
    data.sort(MONTH_SORT);
    this.state = { data };
  }

  /**
   * Get the width from the beginning of the graph to this bar
   * @param {Object} val moment object for start time
   * @return {number} number (width %) from the start
   */
  getTimeFromStart = (val) => {
    // sort array by start date
    const { start, end } = this.props;
    // get max length
    const totalDuration = end.diff(start, 'months');
    const timeFromStart = val.diff(start, 'months');
    const width = Math.floor((timeFromStart / totalDuration) * WIDTH);
    return width > 0 ? width : 0;
  };

  /**
   * function to add elm segment
   * @param {[Object]} segments array to put the segments, will be modified
   * @param {Object} elm object with information about the segment
   * @param {Object} beginning start moment object
   * @param {Object} ending end moment object
   */
  addSegment = (segments, elm, beginning, ending) => {
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

  /**
   * function to
   * @param {[number]} added array of indexes that have been added
   * @param {Object} elm Object for each elm
   * @param {number} i index
   * @return {[Object]} array of objects to be displayed in a row
   */
  getSegments = (added, elm, i) => {
    const { data } = this.state;

    // skip if added already
    if (added[i]) {
      return false;
    }

    // local variables
    const segments = [];
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

  /**
   * function to add empty space between start and elm segment
   * @param {array} segments array to put the segments, will be modified
   * @param {number} width as a % value out of WIDTH
   */
  addEmptySegment = (segments, width) => {
    if (width > 0) {
      segments.push({ width });
    }
  };

  getYearMarkers = () => {
    const { start, end } = this.props;

    const startYear = parseInt(start.format('YYYY'), 10);
    const endYear = parseInt(end.format('YYYY'), 10);

    const years = [];
    for (let year = startYear + 1; year <= endYear; year += 1) {
      years.push(moment(`${year}-01`));
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

  render() {
    const { data } = this.state;
    // track elements added already
    const added = {};

    return (
      <div style={{ width: '100%' }}>
        <Row key={data.length} segments={this.getYearMarkers()} yearMarkers />
        {map(data, (elm, i) => {
          const segments = this.getSegments(added, elm, i);
          return segments
            ? (<Row key={i} segments={segments} first={i === 0} />)
            : null;
        })}
      </div>
    );
  }
}

export default Timeline;

/*
* TODO: expand below on click
*/
