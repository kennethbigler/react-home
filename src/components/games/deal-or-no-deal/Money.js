import React from 'react';
import PropTypes from 'prop-types';
// Parents: Degree

/** render code for each class */
export const Money = props => {
  const { briefcase: bc } = props;
  return <div>{bc.on ? bc.val : <del>{bc.val}</del>}</div>;
};

Money.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  briefcase: PropTypes.object.isRequired
};
