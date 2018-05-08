import React from 'react';
import types from 'prop-types';
import {Class} from './Class';
import map from 'lodash/map';
// Parents: Year

/* render code for each quarter */
export const Quarter = (props) => {
  const {quarter} = props;
  return (
    <div>
      <h3>{quarter.quarter}</h3>
      <ul>{map(quarter.classes, (c) => <Class key={c} name={c} />)}</ul>
    </div>
  );
};

Quarter.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  quarter: types.shape({
    classes: types.arrayOf(types.string).isRequired,
    quarter: types.string.isRequired,
  }).isRequired,
};
