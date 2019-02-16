// react
import React from 'react';
// functions
import map from 'lodash/map';
// components
import Job from './Job';
import TimelineCard from '../../common/TimelineCard';
import ExpandableCard from '../../common/ExpandableCard';
import TechBarChart from './TechBarChart';
// constants
import workExp from '../../../constants/work';
// Parents: Main

const Work = () => (
  <div>
    <h1>
      Work Experience
    </h1>
    <TimelineCard data={workExp} title="Work Timeline" />
    <ExpandableCard title="Programming Language Timeline (Professional Use)">
      <TechBarChart />
    </ExpandableCard>
    {map(workExp, job => <Job key={job.company} job={job} />)}
  </div>
);

export default Work;
