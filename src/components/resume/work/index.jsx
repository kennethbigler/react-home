import React from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Job from './Job';
import TimelineCard from '../../common/TimelineCard';
import ExpandableCard from '../../common/ExpandableCard';
import TechBarChart from './TechBarChart';
import workExp from '../../../constants/work';
// Parents: Main

const Work = () => (
  <div>
    <Typography variant="h2">
      Work Experience
    </Typography>
    <TimelineCard data={workExp} title="Work Timeline" />
    <ExpandableCard title="Programming Language Timeline (Professional Use)">
      <TechBarChart />
    </ExpandableCard>
    {map(workExp, job => <Job key={job.company} job={job} />)}
  </div>
);

export default Work;
