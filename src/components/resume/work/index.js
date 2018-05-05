// react
import React from 'react';
// components
import { Job } from './Job';
import { TimelineCard } from './TimelineCard';
// constants
import workExp from '../../../constants/work';
// Parents: Main

export const Work = () => {
  return (
    <div>
      <h1>Work Experience</h1>
      <TimelineCard workExp={workExp} />
      {workExp.map(job => <Job key={job.company} job={job} />)}
    </div>
  );
};
