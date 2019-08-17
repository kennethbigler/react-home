import React, { memo } from 'react';
import { Typography } from '@material-ui/core';
import Info from './Info';
import Skills from './Skills';
import Education from './Education';
import TimelineCard from '../../common/timeline-card';
// Parents: Main

const Summary = memo(() => (
  <div>
    <Typography variant="h2" gutterBottom>Summary</Typography>
    <Info />
    <TimelineCard />
    <Skills />
    <Education />
  </div>
));

export default Summary;
