import React from 'react';
import types from 'prop-types';
import { Typography } from '@material-ui/core';
// Parents: Quarter

/* render code for each class */
const Class = (props) => {
  const { name, catalog } = props;
  return (
    <Typography>
      <li>
        {catalog && <strong>{`${catalog} - `}</strong>}
        {name}
      </li>
    </Typography>
  );
};

Class.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  name: types.string.isRequired,
  catalog: types.string,
};

export default Class;
