import React from 'react';
import { Typography } from '@material-ui/core';
import TravelTable from './TravelTable';
import WorldMap from './WorldMap';

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable */
const TravelMap: React.FC<{}> = React.memo(() => (
  <>
    <Typography variant="h2">My Travel Map</Typography>
    <WorldMap />
    <TravelTable />
  </>
));

export default TravelMap;
