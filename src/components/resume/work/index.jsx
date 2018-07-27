// react
import React from 'react';
// components
import map from 'lodash/map';
import Job from './Job';
import TimelineCard from './TimelineCard';
// constants
import workExp from '../../../constants/work';
// functions
// Parents: Main

const Work = () => (
  <div>
    <h1>
      Work Experience
    </h1>
    <TimelineCard workExp={workExp} />
    {map(workExp, job => <Job key={job.company} job={job} />)}
  </div>
);

export default Work;
