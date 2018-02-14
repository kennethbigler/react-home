import React from 'react';
import { Cell } from './Cell';
import PropTypes from 'prop-types';
// Parents: Help

/** render code for each class */
export const Row = props => {
  const { name, arr } = props;
  return (
    <tr>
      <td>{name}</td>
      {arr.map((action, i) => <Cell key={i} {...action} />)}
    </tr>
  );
};

Row.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  name: PropTypes.string.isRequired,
  arr: PropTypes.array.isRequired
};
