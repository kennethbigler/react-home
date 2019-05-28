import React, { memo, lazy, Suspense } from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// custom
import Job from './Job';
import TimelineCard from '../../common/TimelineCard';
import ExpandableCard from '../../common/ExpandableCard';
import workExp from '../../../constants/work';
// Parents: Routes (Resume)
const TechBarChart = lazy(() => import('./TechBarChart'));

const Work = memo(() => (
  <div>
    <Typography variant="h2">
      Work Experience
    </Typography>
    <TimelineCard data={workExp} title="Work Timeline" />
    <ExpandableCard title="Programming Language Timeline (Professional Use)">
      <Suspense fallback={<CircularProgress />}><TechBarChart /></Suspense>
    </ExpandableCard>
    {map(workExp, job => <Job key={job.company} job={job} />)}
  </div>
));

export default Work;
