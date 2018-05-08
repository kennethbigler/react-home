import React from 'react';
import types from 'prop-types';
import {Quarter} from './Quarter';
import map from 'lodash/map';
// Parents: Degree

/* render code for each year */
export const Year = (props) => {
  const {year, len} = props;
  return (
    <div className={`col-md-${Math.ceil(12 / len)}`}>
      <h2>{year.year}</h2>
      <hr />
      {map(year.quarters, (quarter) => (
        <Quarter key={quarter.quarter} quarter={quarter} />
      ))}
    </div>
  );
};

Year.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  len: types.number.isRequired,
  year: types.shape({
    year: types.string.isRequired,
    quarters: types.arrayOf(types.shape({quarter: types.string.isRequired})),
  }).isRequired,
};
