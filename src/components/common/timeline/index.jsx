import React, { Component } from 'react';
import types from 'prop-types';
import moment from 'moment';
import includes from 'lodash/includes';
import map from 'lodash/map';
import Row from './Row';
// Parents: Work

export const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';
export const MONTH_SORT = (a, b) => a.start.diff(b.start, 'months');

const WIDTH = 100;
const MIN_TEXT_WIDTH = 94;

export class Timeline extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    data: types.arrayOf(
      types.shape({
        company: types.string.isRequired,
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
  };

  constructor(props) {
    super(props);
    // get immutable data from props and sort by start date
    const data = [...props.data];
    data.sort(MONTH_SORT);
    // get 'start,' but start w/ college not volunteering
    const { start } = data[1];
    // set state and styles
    this.state = { data, start };
  }

  /**
   * Get the width from the beginning of the graph to this bar
   * @param {Object} val moment object for start time
   * @return {number} number (width %) from the start
   */
  getTimeFromStart = (val) => {
    // sort array by start date
    const { start } = this.state;
    // get max length
    const totalDuration = moment().diff(start, 'months');
    const timeFromStart = val.diff(start, 'months');
    const width = Math.floor((timeFromStart / totalDuration) * WIDTH);
    return width > 0 ? width : 0;
  };

  /**
   * function to add job segment
   * @param {[Object]} segments array to put the segments, will be modified
   * @param {Object} job object with information about the segment
   * @param {Object} beginning start moment object
   * @param {Object} ending end moment object
   */
  addCompany = (segments, job, beginning, ending) => {
    const { company, color, title } = job;
    const width = ending - beginning;
    // check if name has room
    if ((width * window.innerWidth) / WIDTH < MIN_TEXT_WIDTH) {
      segments.push({
        company: company.substr(0, 1),
        color,
        width,
        title,
      });
    } else {
      segments.push({
        company,
        color,
        width,
        title,
      });
    }
  };

  /**
   * function to
   * @param {[number]} added array of indexes that have been added
   * @param {Object} job Object for each job
   * @param {number} i index
   * @return {[Object]} array of objects to be displayed in a row
   */
  getSegments = (added, job, i) => {
    const { data } = this.state;

    // skip if added already
    if (includes(added, i)) {
      return [];
    }

    // local variables
    const segments = [];
    const { start, end } = job;
    let beginning = this.getTimeFromStart(start);
    let ending = this.getTimeFromStart(end);

    // add main segments
    this.addSegment(segments, beginning);
    this.addCompany(segments, job, beginning, ending);

    // track that segments have been added
    added.push(i);

    // find any other segments that will fit
    for (let j = i + 1; j < data.length; j += 1) {
      // skip if added already
      if (!includes(added, j)) {
        // test segment
        const { start: jStart, end: jEnd } = data[j];
        beginning = this.getTimeFromStart(jStart);

        // if start is after end of main segment
        if (beginning >= ending) {
          // add filler in between end/start
          this.addSegment(segments, beginning - ending);
          // add next company
          ending = this.getTimeFromStart(jEnd);
          this.addCompany(segments, data[j], beginning, ending);
          // mark as already added
          added.push(j);
        }
      }
    }

    // get last segment
    this.addSegment(segments, WIDTH - ending);

    return [...segments];
  };

  /**
   * function to add empty space between start and job segment
   * @param {array} segments array to put the segments, will be modified
   * @param {number} width as a % value out of WIDTH
   */
  addSegment = (segments, width) => {
    if (width > 0) {
      segments.push({ width });
    }
  };

  render() {
    const { data } = this.state;
    // track elements added already
    const added = [];

    return (
      <div style={{ width: '100%' }}>
        {map(data, (job, i) => (
          <Row key={i} segments={this.getSegments(added, job, i)} />
        ))}
      </div>
    );
  }
}

export default Timeline;

/*
* TODO: expand below on click
*/
