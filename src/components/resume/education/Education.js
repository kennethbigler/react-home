import React from 'react';
import PropTypes from 'prop-types';
import { Degree } from './Degree';
// Parents: Main

export const Education = props => {
  const { classes, onTouchTap, expanded } = props;
  return (
    <div>
      <h1>Education and Extracurriculars</h1>
      {classes.map(d => (
        <Degree
          key={d.degree}
          onTouchTap={onTouchTap}
          expanded={expanded}
          degree={d}
        />
      ))}
    </div>
  );
};

Education.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onTouchTap: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
