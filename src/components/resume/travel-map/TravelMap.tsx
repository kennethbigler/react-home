import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ExpandableCard from "../../common/expandable-card";
import CountryTable from "./map/CountryTable";
import WorldMap from "./map/WorldMap";
import CruiseTable from "./cruises/CruiseTable";
import CruiseCharts from "./cruises/CruiseCharts";
import LoyaltyCharts from "./cruises/LoyaltyCharts";

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable
 *           |->  CruiseCharts */
const TravelMap = React.memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Travel
    </Typography>
    <Grid container spacing={2}>
      {/* @ts-expect-error - custom breakpoint */}
      <Grid size={{ xs: 12, md: 6, xxl: 4 }}>
        <ExpandableCard title="Travel Map">
          <WorldMap />
          <CountryTable />
        </ExpandableCard>
      </Grid>
      {/* @ts-expect-error - custom breakpoint */}
      <Grid size={{ xs: 12, md: 6, xxl: 4 }}>
        <ExpandableCard title="Cruise Charts">
          <CruiseCharts />
          <LoyaltyCharts />
        </ExpandableCard>
      </Grid>
      {/* @ts-expect-error - custom breakpoint */}
      <Grid size={{ xs: 12, xxl: 4 }}>
        <ExpandableCard title="Cruises">
          <CruiseTable />
        </ExpandableCard>
      </Grid>
    </Grid>
  </>
));

TravelMap.displayName = "TravelMap";

export default TravelMap;
