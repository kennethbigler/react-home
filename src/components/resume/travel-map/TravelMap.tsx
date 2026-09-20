import { memo } from "react";
import { Grid, Typography } from "@mui/material";
import ExpandableCard from "@/components/common/expandable-card";
import guardChart from "@/components/common/highcharts/guardChart";
import CountryTable from "./map/CountryTable";
import CruiseTable from "./cruises/CruiseTable";

const WorldMap = guardChart(() => import("./map/WorldMap"));
const CruiseSankeyGraph = guardChart(
  () => import("./cruises/CruiseSankeyGraph"),
);
const LoyaltyCharts = guardChart(() => import("./cruises/LoyaltyCharts"));
const TravelDaysGraph = guardChart(() => import("./TravelDaysGraph"));

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable
 *           |->  CruiseSankeyGraph */
const TravelMap = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Travel
    </Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6, xxl: 4 }}>
        <ExpandableCard title="Travel Map">
          <WorldMap />
          <CountryTable />
          <TravelDaysGraph />
        </ExpandableCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6, xxl: 4 }}>
        <ExpandableCard title="Cruise Charts">
          <CruiseSankeyGraph />
          <LoyaltyCharts />
        </ExpandableCard>
      </Grid>
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
