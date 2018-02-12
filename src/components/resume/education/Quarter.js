import React from 'react';
import PropTypes from 'prop-types';
import { Class } from './Class';
// Parents: Year

/** render code for each quarter */
export const Quarter = props => {
  const { quarter } = props;
  return (
    <div>
      <h4>{quarter.quarter}</h4>
      <ul>{quarter.classes.map(c => <Class key={c} name={c} />)}</ul>
    </div>
  );
};

Quarter.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  quarter: PropTypes.object.isRequired
};
