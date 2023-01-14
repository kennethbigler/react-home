import * as React from "react";
import Typography from "@mui/material/Typography";
import TravelTable from "./TravelTable";
import WorldMap from "./WorldMap";
import CruiseCharts from "./CruiseCharts";

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable
 *           |->  CruiseCharts */
const TravelMap: React.FC = () => {
  const screenWidth = document.body.clientWidth - 32;

  return (
    <>
      <Typography variant="h2" component="h1">
        My Travel Map
      </Typography>
      <WorldMap screenWidth={screenWidth} />
      <TravelTable />
      <CruiseCharts screenWidth={screenWidth} />
    </>
  );
};

export default TravelMap;
