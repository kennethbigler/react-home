import React from 'react';
import Info from './Info';
import Skills from './Skills';
import Education from './Education';
import TimelineCard from '../../common/TimelineCard';
// Parents: Main

const Summary = () => (
  <div>
    <h1>Summary</h1>
    <Info />
    <TimelineCard />
    <Skills />
    <Education />
  </div>
);

export default Summary;
