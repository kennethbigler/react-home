import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import moment from 'moment';

const styles = {
  corpLogo: {
    width: '100%',
    maxWidth: '12em'
  }
};

function showRange(s, e, n) {
  // format of date
  const FORMAT = 'MMMM Y';
  // start date
  const start = s.format(FORMAT);
  // end date, check if it is the present
  const end = moment().diff(e, 'days') < 1 ? 'Present' : e.format(FORMAT);
  // add optional notes
  const notes = n ? n : '';

  // get the time range in years, months
  const mon = e.diff(s, 'months') % 12;
  const yr = e.diff(s, 'years');
  const yRange = yr ? `${yr} year${yr > 1 ? 's' : ''}` : null;
  const mRange = mon ? `${mon} month${mon > 1 ? 's' : ''}` : null;
  const range = yRange ? yRange + (mRange ? `, ${mRange}` : '') : mRange;
  // works faster but is a rough estimate
  // const range = e.to(s, true);

  // return string for output
  return `${start} - ${end} (${range}) ${notes}`;
}

const Timeline = props => {
  return (
    <div>
      {props.workExp.map(job => {
        return (
          <div>
            <div className="col-sm-9 col-xs-12">
              <p>{showRange(job.start, job.end, job.notes)}</p>
              <ul>
                {job.expr.map((desc, i) => {
                  return <li key={'desc' + i}>{desc}</li>;
                })}
              </ul>
            </div>
            <img
              className="col-sm-3 col-xs-12 pull-right"
              style={styles.corpLogo}
              src={job.src}
              alt={job.alt}
            />
          </div>
        );
      })}
    </div>
  );
};

Timeline.propTypes = {
  workExp: PropTypes.array.isRequired
};

export default Timeline;
