// react
import React from 'react';
// components
import { Degree } from './Degree';
// constants
import classes from '../../../constants/classes';
// functions
import map from 'lodash/map';
// Parents: Main

export const Education = () => {
  return (
    <div>
      <h1>Education and Extracurriculars</h1>
      {map(classes, d => <Degree degree={d} key={d.degree} />)}
    </div>
  );
};
