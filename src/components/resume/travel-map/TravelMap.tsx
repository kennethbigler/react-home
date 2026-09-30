import { memo } from "react";
import { Grid, Typography } from "@mui/material";
import ExpandableCard from "@/components/common/expandable-card";
import { ChartSection } from "@/components/common/highcharts/ChartSection";
import {
  guardChart,
  groupedChart,
} from "@/components/common/highcharts/guardChart";
import CountryTable from "./map/CountryTable";
import CruiseTable from "./cruises/CruiseTable";

const WorldMap = guardChart(() => import("./map/WorldMap"));
const CruiseSankeyGraph = groupedChart(
  () => import("./cruises/CruiseSankeyGraph"),
);
const LoyaltyCharts = groupedChart(() => import("./cruises/LoyaltyCharts"));
const CruiseAwardCharts = groupedChart(
  () => import("./cruises/CruiseAwardCharts"),
);
const TravelDaysGraph = guardChart(() => import("./TravelDaysGraph"));

/* TravelMap  ->  WorldMap  ->  Popover
 *           |->  TravelTable
 *           |->  CruiseSankeyGraph
 *           |->  CruiseRankings */
const cardSize = { xs: 12, md: 6, xxl: 3 } as const;

const TravelMap = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Travel
    </Typography>
    <Grid container spacing={2}>
      <Grid size={cardSize}>
        <ExpandableCard title="Travel Map">
          <WorldMap />
          <CountryTable />
          <TravelDaysGraph />
        </ExpandableCard>
      </Grid>
      <Grid size={cardSize}>
        <ExpandableCard title="Cruise Charts">
          <ChartSection>
            <CruiseSankeyGraph />
            <LoyaltyCharts />
          </ChartSection>
        </ExpandableCard>
      </Grid>
      <Grid size={cardSize}>
        <ExpandableCard title="Cruise Rankings">
          <ChartSection>
            <CruiseAwardCharts />
          </ChartSection>
        </ExpandableCard>
      </Grid>
      <Grid size={cardSize}>
        <ExpandableCard title="Cruises">
          <CruiseTable />
        </ExpandableCard>
      </Grid>
    </Grid>
  </>
));

TravelMap.displayName = "TravelMap";

export default TravelMap;
