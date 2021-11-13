import React from "react";
import { Typography } from "@mui/material";
import TravelTable from "./TravelTable";
import WorldMap from "./WorldMap";

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable */
const TravelMap: React.FC = React.memo(() => (
  <>
    <Typography variant="h2">My Travel Map</Typography>
    <WorldMap />
    <TravelTable />
  </>
));

export default TravelMap;
