// react
import React from 'react';
// components
import map from 'lodash/map';
import Degree from './Degree';
// constants
import classes from '../../../constants/classes';
// functions
// Parents: Main

const Education = () => (
  <div>
    <h1>
      Education and Extracurriculars
    </h1>
    {map(classes, d => <Degree key={d.degree} degree={d} />)}
  </div>
);

export default Education;
