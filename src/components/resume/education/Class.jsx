import React from 'react';
import types from 'prop-types';
// Parents: Quarter

/* render code for each class */
const Class = (props) => {
  const { name, catalog } = props;
  return (
    <li>
      {catalog && <strong>{`${catalog} - `}</strong>}
      {name}
    </li>
  );
};

Class.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  name: types.string.isRequired,
  catalog: types.string,
};

export default Class;
