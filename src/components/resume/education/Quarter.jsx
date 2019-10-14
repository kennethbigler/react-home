import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Class from './Class';
// Parents: Year

/* render code for each quarter */
const Quarter = (props) => {
  const { quarter } = props;
  return (
    <>
      <Typography variant="h5">
        {quarter.quarter}
      </Typography>
      <ul>
        {map(quarter.classes, (c) => <Class key={c.name} name={c.name} catalog={c.catalog} />)}
      </ul>
    </>
  );
};

Quarter.propTypes = {
  quarter: types.shape({
    classes: types.arrayOf(types.shape({
      name: types.string.isRequired,
      catalog: types.string,
    })).isRequired,
    quarter: types.string.isRequired,
  }).isRequired,
};

export default Quarter;
