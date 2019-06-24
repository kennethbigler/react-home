import React, { memo } from 'react';
import types from 'prop-types';
import { Typography } from '@material-ui/core';
// Parents: Quarter

/* render code for each class */
const Class = memo((props) => {
  const { name, catalog } = props;
  return (
    <Typography>
      <li>
        {catalog && <strong>{`${catalog} - `}</strong>}
        {name}
      </li>
    </Typography>
  );
});

Class.propTypes = {
  name: types.string.isRequired,
  catalog: types.string,
};

export default Class;
