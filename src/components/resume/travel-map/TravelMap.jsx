import React, { memo, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import TravelTable from './TravelTable';
import WorldMap from './WorldMap';

const TravelMap = memo(() => (
  <Fragment>
    <Typography variant="h2">My Travel Map</Typography>
    <WorldMap />
    <TravelTable />
  </Fragment>
));

export default TravelMap;
