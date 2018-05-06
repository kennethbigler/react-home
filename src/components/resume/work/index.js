// react
import React from 'react';
// components
import { Job } from './Job';
import { TimelineCard } from './TimelineCard';
// constants
import workExp from '../../../constants/work';
// functions
import map from 'lodash/map';
// Parents: Main

export const Work = () => {
  return (
    <div>
      <h1>Work Experience</h1>
      <TimelineCard workExp={workExp} />
      {map(workExp, job => <Job job={job} key={job.company} />)}
    </div>
  );
};
