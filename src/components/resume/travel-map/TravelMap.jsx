import React from 'react';
import { Typography } from '@material-ui/core';
import TravelTable from './TravelTable';
import WorldMap from './WorldMap';

const TravelMap = () => (
  <div>
    <Typography variant="h2">My Travel Map</Typography>
    <WorldMap />
    <TravelTable />
  </div>
);

export default TravelMap;
