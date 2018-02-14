import React from 'react';
import PropTypes from 'prop-types';
// Parents: Help

/** render code for each class */
export const Cell = props => {
  const { type, action } = props;
  return <td className={type}>{action}</td>;
};

Cell.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  type: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired
};
