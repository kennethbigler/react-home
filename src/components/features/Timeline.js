import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as colors from 'material-ui/styles/colors';

export const FORMAT = 'MMMM Y';
export const TIMELINE_TITLE = 'Timeline';

const styles = {
  off: {
    display: 'inline-block'
  },
  on: {
    display: 'inline-block',
    boxShadow: '2px 3px 4px #999',
    backgroundColor: colors.indigoA700,
    maxHeight: '100px'
  }
};

export const Timeline = props => {
  // sort array by start date
  props.data.sort((a, b) => {
    return a.start.diff(b.start, 'months');
  });

  // get max length
  const beginning = props.data[0].start;
  const total_duration = moment().diff(beginning, 'months');

  const WIDTH = 100;

  let added = [];

  return (
    <div>
      {props.data.map((job, i) => {
        // skip if added already
        if (added.indexOf[i] === -1) {
          return;
        }

        // properties
        // company: 'Santa Clara University',
        // location: 'Santa Clara, CA',
        // title: 'Undergraduate Student',
        // start: moment('2011-09-01'),
        // end: moment('2015-06-30')

        // get start and end
        const start = Math.floor(
          job.start.diff(beginning, 'months') / total_duration * WIDTH
        );
        const end = Math.floor(
          job.end.diff(beginning, 'months') / total_duration * WIDTH
        );
        const mid = end - start;

        added.push(i);

        let filler;

        for (let j = i + 1; j < props.data.length; j += 1) {
          const com = props.data[j];
          const next = Math.floor(
            com.start.diff(beginning, 'months') / total_duration * WIDTH
          );
          if (next >= end) {
            console.log(end, next, `${job.company} & ${com.company}`);
            // add fake in between end/start
            // const gap = next - end;
            // filler += (
            //   {gap > 0 && <div style={{ ...styles.off, width: `${gap}%` }} />}
            //   <div style={{ ...styles.on, width: `${mid}%` }}>
            //     <div />
            //     );
            // pop off todo
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
