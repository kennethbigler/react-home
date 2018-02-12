import React from 'react';
import PropTypes from 'prop-types';
import { Quarter } from './Quarter';
// Parents: Degree

/** render code for each year */
export const Year = props => {
  const { year, len } = props;
  return (
    <div className={`col-md-${Math.ceil(12 / len)}`}>
      <h3>{year.year}</h3>
      <hr />
      {year.quarters.map(quarter => (
        <Quarter key={quarter.quarter} quarter={quarter} />
      ))}
    </div>
  );
};

Year.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  len: PropTypes.number.isRequired,
  year: PropTypes.object.isRequired
};
