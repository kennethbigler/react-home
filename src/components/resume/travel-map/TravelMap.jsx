import React, { memo } from 'react';
import { Typography } from '@material-ui/core';
import TravelTable from './TravelTable';
import WorldMap from './WorldMap';

const TravelMap = memo(() => (
  <div>
    <Typography variant="h2">My Travel Map</Typography>
    <WorldMap />
    <TravelTable />
  </div>
));

export default TravelMap;
