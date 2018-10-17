// react
import React from 'react';
// components
import map from 'lodash/map';
import Degree from './Degree';
import TimelineCard from '../../common/TimelineCard';
// constants
import classes, { classTimeline } from '../../../constants/classes';
// functions
// Parents: Main

const Education = () => (
  <div>
    <h1>
      Education and Extracurriculars
    </h1>
    <TimelineCard
      data={classTimeline}
      selector="course"
      start={classTimeline[0].start}
      end={classTimeline[classTimeline.length - 1].end}
    />
    {map(classes, d => <Degree key={d.degree} degree={d} />)}
  </div>
);

export default Education;
