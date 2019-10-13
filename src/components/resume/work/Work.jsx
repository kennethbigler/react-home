import React, {
  memo, lazy, Suspense, Fragment,
} from 'react';
import { Typography } from '@material-ui/core';
// custom
import TimelineCard from '../../common/timeline-card';
import ExpandableCard from '../../common/expandable-card';
import workExp, { VOLUNTEER, WORK } from '../../../constants/work';
import LoadingSpinner from '../../common/loading-spinner';
import WorkCards from './WorkCards';
// Parents: Routes (Resume)
const TechBarChart = lazy(() => import(/* webpackChunkName: "r_work_bar_chart" */ './TechBarChart'));

const Work = memo(() => (
  <>
    <Typography variant="h2">Experience</Typography>
    <TimelineCard data={workExp} title="Work Timeline" />
    <ExpandableCard title="Programming Language Timeline (Professional Use)">
      <Suspense fallback={<LoadingSpinner />}><TechBarChart /></Suspense>
    </ExpandableCard>
    <WorkCards workExp={workExp} workTypes={[WORK, VOLUNTEER]} />
  </>
));

export default Work;
