import React from 'react';
import types from 'prop-types';
import { Class } from './Class';
// Parents: Year

/** render code for each quarter */
export const Quarter = props => {
  const { quarter } = props;
  return (
    <div>
      <h3>{quarter.quarter}</h3>
      <ul>{quarter.classes.map(c => <Class key={c} name={c} />)}</ul>
    </div>
  );
};

Quarter.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  quarter: types.shape({
    quarter: types.string.isRequired,
    classes: types.arrayOf(types.string).isRequired
  }).isRequired
};
