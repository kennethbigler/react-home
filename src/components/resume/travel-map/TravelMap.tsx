import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CountryTable from "./CountryTable";
import CruiseTable from "./CruiseTable";
import WorldMap from "./WorldMap";
import CruiseCharts from "./CruiseCharts";
import ExpandableCard from "../../common/expandable-card";

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable
 *           |->  CruiseCharts */
const TravelMap: React.FC = () => (
  <>
    <Typography variant="h2" component="h1">
      Travel
    </Typography>
    <Grid container spacing={2}>
      <Grid item sm={12} md={6}>
        <ExpandableCard title="Travel Map">
          <WorldMap />
          <CountryTable />
        </ExpandableCard>
      </Grid>
      <Grid item sm={12} md={6}>
        <ExpandableCard title="Cruises">
          <CruiseCharts />
          <CruiseTable />
        </ExpandableCard>
      </Grid>
    </Grid>
  </>
);

export default TravelMap;
