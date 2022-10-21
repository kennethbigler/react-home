import React from "react";
import Typography from "@mui/material/Typography";
import TravelTable from "./TravelTable";
import WorldMap from "./WorldMap";

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable */
const TravelMap: React.FC = React.memo(() => (
  <>
    <Typography variant="h1">My Travel Map</Typography>
    <WorldMap />
    <TravelTable />
  </>
));

export default TravelMap;
