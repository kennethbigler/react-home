import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as colors from 'material-ui/styles/colors';

export const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';

export const Timeline = props => {
  // sort array by start date
  props.data.sort((a, b) => {
    return a.start.diff(b.start, 'months');
  });

  // get max length
  const beginning = props.data[0].start;
  const total_duration = moment().diff(beginning, 'months');

  const styles = {
    off: {
      display: 'inline-block'
    },
    on: {
      backgroundColor: colors.indigoA700,
      maxHeight: '100px',
      display: 'inline-block'
    }
  };

  const WIDTH = 100;

  return (
    <div>
      {props.data.map((job, i) => {
        // company: 'Santa Clara University',
        // location: 'Santa Clara, CA',
        // title: 'Undergraduate Student',
        // start: moment('2011-09-01'),
        // end: moment('2015-06-30')
        const start = Math.floor(
          job.start.diff(beginning, 'months') / total_duration * WIDTH
        );
        const end = Math.floor(
          job.end.diff(beginning, 'months') / total_duration * WIDTH
        );
        const mid = end - start;

        for (let j = i + 1; j < props.data.length; j += 1) {
          const next = Math.floor(
            props.data[j].start.diff(beginning, 'months') /
              total_duration *
              WIDTH
          );
          if (next >= end) {
            console.log(end, next, `${job.company} & ${props.data[j].company}`);
          }
        }
        console.log('----------');

        const last = WIDTH - end;

        return (
          <div className="row" key={i}>
            {start > 0 && <div style={{ ...styles.off, width: `${start}%` }} />}
            <div style={{ ...styles.on, width: `${mid}%` }}>
              {job.company}
              <br />
              {job.title}
            </div>
            {last > 0 && <div style={{ ...styles.off, width: `${last}%` }} />}
          </div>
        );
      })}
    </div>
  );
};

Timeline.propTypes = {
  data: PropTypes.array.isRequired
};
