import React from 'react';
import types from 'prop-types';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Quarter from './Quarter';
// Parents: Degree

/* render code for each year */
const Year = (props) => {
  const { year, len } = props;
  return (
    <Grid item md={Math.ceil(12 / len)} xs={12}>
      <Typography variant="h4">
        {year.year}
      </Typography>
      <hr />
      {map(year.quarters, quarter => (
        <Quarter key={quarter.quarter} quarter={quarter} />
      ))}
    </Grid>
  );
};

Year.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  len: types.number.isRequired,
  year: types.shape({
    year: types.string.isRequired,
    quarters: types.arrayOf(types.shape({ quarter: types.string.isRequired })),
  }).isRequired,
};

export default Year;
