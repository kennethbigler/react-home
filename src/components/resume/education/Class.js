import React from 'react';
import types from 'prop-types';
// Parents: Degree

/** render code for each class */
export const Class = props => {
  return <li>{props.name}</li>;
};

Class.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  name: types.string.isRequired
};
