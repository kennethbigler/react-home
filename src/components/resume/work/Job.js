import React from 'react';
import PropTypes from 'prop-types';
import { ExpandableCard } from '../../common/ExpandableCard';
import { FORMAT } from '../../common/timeline/Timeline';
import moment from 'moment';
// Parents: Work

function showRange(s, e, n) {
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

  // return string for output
  return `${start} - ${end} (${range}) ${notes}`;
}

/** function to generate timeline card */
export const Job = props => {
  const { job, onTouchTap, expanded } = props;

  const imgStyle = { width: '100%', maxWidth: '12em', height: 'auto' };
  const mainTxt = 'col-sm-9 col-xs-12';
  const sideTxt = 'col-sm-3 col-xs-12';
  const handleExpand = exp => onTouchTap(job.company, exp);
  const parent = job.parent ? ` (${job.parent})` : '';
  const title = `${job.company}${parent}, ${job.location}`;
  const subtitle = job.title;

  return job.isJob ? (
    <ExpandableCard
      expanded={expanded[job.company]}
      onExpandChange={handleExpand}
      title={title}
      subtitle={subtitle}
    >
      <div className={mainTxt}>
        <p>{showRange(job.start, job.end, job.notes)}</p>
        <ul>{job.expr.map((desc, i) => <li key={`desc${i}`}>{desc}</li>)}</ul>
      </div>
      <div className={sideTxt}>
        <img
          className="float-right"
          style={imgStyle}
          src={job.src}
          alt={job.alt}
        />
      </div>
    </ExpandableCard>
  ) : (
    <div />
  );
};

Job.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  job: PropTypes.object.isRequired,
  expanded: PropTypes.object.isRequired,
  onTouchTap: PropTypes.func.isRequired
};
