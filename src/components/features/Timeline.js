import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as colors from 'material-ui/styles/colors';
// Parents: Work

export const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';
export const MONTH_SORT = (a, b) => a.start.diff(b.start, 'months');

const WIDTH = 100;
const MIN_TEXT_WIDTH = 94;

const styles = {
  row: {
    marginTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  box: {
    display: 'inline-block',
    padding: '5px',
    boxShadow: '2px 3px 4px #999',
    color: colors.grey50,
    textAlign: 'center'
  }
};

export class Timeline extends Component {
  constructor(props) {
    super(props);
    let data = [...props.data];
    data.sort(MONTH_SORT);
    this.state = { data };
  }

  getTimeFromStart = val => {
    // sort array by start date
    const { start } = this.state.data[0];
    // get max length
    const total_duration = moment().diff(start, 'months');
    return Math.floor(val.diff(start, 'months') / total_duration * WIDTH);
  };

  addCompany = (ending, beginning, segments, company, color, title) => {
    const width = ending - beginning;
    // check if name has room
    if (width * window.innerWidth / WIDTH < MIN_TEXT_WIDTH) {
      segments.push({ company: company.substr(0, 1), color, width, title });
    } else {
      segments.push({ company, color, width, title });
    }
  };

  addSegment = (width, segments) => {
    if (width > 0) {
      segments.push({ width });
    }
  };

  getSegments = (added, job, i) => {
    const { data } = this.state;

    // skip if added already
    if (added.indexOf(i) !== -1) {
      return [];
    }

    // local variables
    let segments = [];
    const { start, end, company, color, title } = job;
    let beginning = this.getTimeFromStart(start);
    let ending = this.getTimeFromStart(end);

    // add main segments
    this.addSegment(beginning, segments);
    this.addCompany(ending, beginning, segments, company, color, title);

    // track that segments have been added
    added.push(i);

    // find any other segments that will fit
    for (let j = i + 1; j < data.length; j += 1) {
      // skip if added already
      if (added.indexOf(j) === -1) {
        // test segment
        const { start, end, company, color } = data[j];
        beginning = this.getTimeFromStart(start);

        // if start is after end of main segment
        if (beginning >= ending) {
          // add filler in between end/start
          this.addSegment(beginning - ending, segments);
          // add next company
          ending = this.getTimeFromStart(end);
          this.addCompany(ending, beginning, segments, company, color, title);
          // mark as already added
          added.push(j);
        }
      }
    }

    // get last segment
    this.addSegment(WIDTH - ending, segments);

    return [...segments];
  };

  render() {
    const { data } = this.state;
    // track elements added already
    let added = [];

    return (
      <div className="col-sm-12">
        {data.map((job, i) => {
          // track segments to add
          const segments = this.getSegments(added, job, i);

          return (
            <div style={styles.row} key={i}>
              {segments.map((seg, j) => {
                const { company, width, color, title } = seg;
                // check if company or filler
                if (company) {
                  return (
                    <div
                      key={`${i},${j}`}
                      title={title}
                      style={{
                        ...styles.box,
                        width: `${width}%`,
                        backgroundColor: color
                      }}
                    >
                      {seg.company}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`${i},${j}`}
                      style={{ display: 'inline-block', width: `${width}%` }}
                    >
                      <br />
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

Timeline.propTypes = {
  data: PropTypes.array.isRequired
};

/*
* expand below on click
* add hover text
*/
