import * as React from "react";
import Typography from "@mui/material/Typography";
import CountryTable from "./CountryTable";
import CruiseTable from "./CruiseTable";
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
      <CountryTable />
      <br />
      <Typography variant="h2">Cruises</Typography>
      <CruiseCharts screenWidth={screenWidth} />
      <CruiseTable />
    </>
  );
};

export default TravelMap;
