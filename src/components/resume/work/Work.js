import React from 'react';
import PropTypes from 'prop-types';
import { Job } from './Job';
import { TimelineCard } from './TimelineCard';
// Parents: Main

export const Work = props => {
  const { workExp, expanded, onTouchTap } = props;
  return (
    <div>
      <h1>Work Experience</h1>
      <TimelineCard {...props} />
      {workExp.map(job => (
        <Job
          key={job.company}
          job={job}
          expanded={expanded}
          onTouchTap={onTouchTap}
        />
      ))}
    </div>
  );
};

Work.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onTouchTap: PropTypes.func.isRequired,
  workExp: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
