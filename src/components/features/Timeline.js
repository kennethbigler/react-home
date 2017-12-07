import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';

export const Timeline = props => {
  // sort array by start date
  props.data.sort((a, b) => {
    return a.start.diff(b.start, 'months');
  });

  // get max length
  const beginning = props.data[0].start;
  const total_duration = moment().diff(beginning, 'months');
  console.log(total_duration);

  const styles = {
    black: {
      backgroundColor: 'black',
      height: '100px',
      display: 'inline-block'
    },
    red: { backgroundColor: 'red', height: '100px', display: 'inline-block' }
  };

  return (
    <div>
      {props.data.map((job, i) => {
        // company: 'Santa Clara University',
        // location: 'Santa Clara, CA',
        // title: 'Undergraduate Student',
        // start: moment('2011-09-01'),
        // end: moment('2015-06-30')
        const start = Math.floor(
          job.start.diff(beginning, 'months') / total_duration * 1000
        );
        const end = Math.floor(
          job.end.diff(beginning, 'months') / total_duration * 1000
        );

        const mid = end - start;
        const last = 1000 - end;

        return (
          <div className="row" key={i}>
            {start > 0 && (
              <div style={{ ...styles.black, width: `${start}px` }} />
            )}
            <div style={{ ...styles.red, width: `${mid}px` }}>
              <ul>
                <li>{job.company}</li>
                <li>{job.title}</li>
                <li>{job.location}</li>
                <li>{job.start.format(FORMAT)}</li>
              </ul>
            </div>
            {last > 0 && (
              <div style={{ ...styles.black, width: `${last}px` }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

Timeline.propTypes = {
  data: PropTypes.array.isRequired
};
