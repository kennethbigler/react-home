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
    padding: '5px'
  },
  on: {
    // added border if all segments are the same color
    // borderStyle: 'solid',
    // borderWidth: '0 2px 0 0',
    // borderColor: colors.indigoA700,
    boxShadow: '2px 3px 4px #999',
    color: colors.grey50
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

  getSegments = (added, job, i) => {
    const { data } = this.state;

    // skip if added already
    if (added.indexOf(i) !== -1) {
      return [];
    }

    // local variables
    let segments = [];
    let start = this.getTimeFromStart(job.start);
    let end = this.getTimeFromStart(job.end);

    // add main segments
    if (start > 0) {
      segments.push({ width: start });
    }
    const width = end - start;
    // check if name has room
    if (width * window.innerWidth / WIDTH < MIN_TEXT_WIDTH) {
      segments.push({
        company: job.company.substr(0, 1),
        color: job.color,
        width
      });
    } else {
      segments.push({ company: job.company, color: job.color, width });
    }

    // track that segments have been added
    added.push(i);

    // find any other segments that will fit
    for (let j = i + 1; j < data.length; j += 1) {
      // skip if added already
      if (added.indexOf(j) !== -1) {
        continue;
      }
      // test segment
      const com = data[j];
      start = this.getTimeFromStart(com.start);

      // if start is after end of main segment
      if (start >= end) {
        // add filler in between end/start
        if (start - end > 0) {
          segments.push({ width: start - end });
        }
        // add next company
        end = this.getTimeFromStart(com.end);
        const width = end - start;
        // check if name has room
        if (width * window.innerWidth / WIDTH < MIN_TEXT_WIDTH) {
          segments.push({
            company: com.company.substr(0, 1),
            color: com.color,
            width
          });
        } else {
          segments.push({ company: com.company, color: com.color, width });
        }
        // mark as already added
        added.push(j);
      }
    }

    // get last segment
    if (WIDTH - end > 0) {
      segments.push({ width: WIDTH - end });
    }

    return [...segments];
  };

  render() {
    const { data } = this.state;
    // track elements added already
    let added = [];

    return (
      <div>
        {data.map((job, i) => {
          // track segments to add
          const segments = this.getSegments(added, job, i);

          return (
            <div style={styles.row} key={i}>
              {segments.map((seg, j) => {
                // check if company or filler
                if (seg.company) {
                  return (
                    <div
                      key={`${i},${j}`}
                      style={{
                        ...styles.box,
                        ...styles.on,
                        width: `${seg.width}%`,
                        backgroundColor: seg.color
                      }}
                    >
                      {seg.company}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`${i},${j}`}
                      style={{ ...styles.box, width: `${seg.width}%` }}
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
* change project menu color
*/
