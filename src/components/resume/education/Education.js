// react
import React from 'react';
// components
import { Degree } from './Degree';
// constants
import classes from '../../../constants/classes';
// Parents: Main

export const Education = () => {
  return (
    <div>
      <h1>Education and Extracurriculars</h1>
      {classes.map(d => <Degree key={d.degree} degree={d} />)}
    </div>
  );
};
