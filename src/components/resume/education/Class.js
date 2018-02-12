import React from 'react';
import PropTypes from 'prop-types';
// Parents: Degree

/** render code for each class */
export const Class = props => {
  return <li>{props.name}</li>;
};

Class.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  name: PropTypes.string.isRequired
};
