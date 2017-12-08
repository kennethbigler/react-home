import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as colors from 'material-ui/styles/colors';

export const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';

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
    borderStyle: 'solid',
    borderWidth: '0 2px 0 0',
    borderColor: colors.indigoA700,
    boxShadow: '2px 3px 4px #999',
    backgroundColor: colors.cyan300
  }
};

export const Timeline = props => {
  // sort array by start date
  props.data.sort((a, b) => a.start.diff(b.start, 'months'));

  // get max length
  const beginning = props.data[0].start;
  const total_duration = moment().diff(beginning, 'months');
  const WIDTH = 100;
  const getTimeFromStart = val => {
    return Math.floor(val.diff(beginning, 'months') / total_duration * WIDTH);
  };

  // track elements added already
  let added = [];

  return (
    <div>
      {props.data.map((job, i) => {
        // skip if added already
        if (added.indexOf(i) !== -1) {
          return;
        }

        // local variables
        // track segments to add
        let segments = [];
        // get start and end
        let start = getTimeFromStart(job.start);
        let end = getTimeFromStart(job.end);

        // add main segments
        if (start > 0) {
          segments.push({ width: start });
        }
        segments.push({ company: job.company, width: end - start });
        // track that segments have been added
        added.push(i);

        // find any other segments that will fit
        for (let j = i + 1; j < props.data.length; j += 1) {
          // skip if added already
          if (added.indexOf(j) !== -1) {
            continue;
          }
          // test segment
          const com = props.data[j];
          start = getTimeFromStart(com.start);

          // if start is after end of main segment
          if (start >= end) {
            // add filler in between end/start
            const gap = start - end;
            if (gap > 0) {
              segments.push({ width: gap });
            }
            // add next company
            end = getTimeFromStart(com.end);
            segments.push({ company: com.company, width: end - start });
            // mark as already added
            added.push(j);
          }
        }

        const last = WIDTH - end;
        if (last > 0) {
          segments.push({ width: last });
        }

        return (
          <div style={styles.row} key={i}>
            {segments.map((seg, j) => {
              if (seg.company) {
                return (
                  <div
                    key={i + j + seg.company}
                    style={{
                      ...styles.box,
                      ...styles.on,
                      width: `${seg.width}%`
                    }}
                  >
                    {seg.company}
                  </div>
                );
              } else {
                return (
                  <div
                    key={i + j}
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
};

Timeline.propTypes = {
  data: PropTypes.array.isRequired
};
