import React from 'react';
import types from 'prop-types';
// Parents: Degree

/* render code for each class */
const Class = (props) => {
  const { name } = props;
  return (
    <li>
      {name}
    </li>
  );
};

Class.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  name: types.string.isRequired,
};

export default Class;
