import { Typography, Grid } from "@mui/material";
import { useAtomValue } from "jotai";
import {
  guardChart,
  groupedChart,
} from "@/components/common/highcharts/guardChart";
import { ChartSection } from "@/components/common/highcharts/ChartSection";
import ExpandableCard from "@/components/common/expandable-card";
import themeAtom from "@/jotai/theme-atom";
import {
  RED_BULL_HEX,
  MCLAREN_HEX,
  ASTON_HEX,
  contractData,
} from "@/constants/f1";
import Tracks from "./Tracks";
import TimelineCard from "./timeline-card/TimelineCard";

const BudgetSankey = guardChart(() => import("./charts/BudgetSankey"));
const ConstructorCurrentSpline = groupedChart(
  () => import("./charts/ConstructorCurrentSpline"),
);
const ConstructorPointsLine = groupedChart(
  () => import("./charts/ConstructorPointsLine"),
);
const ConstructorStandingsLine = groupedChart(
  () => import("./charts/ConstructorStandingsLine"),
);
const DriverCurrentSpline = groupedChart(
  () => import("./charts/DriverCurrentSpline"),
);
const DriverPointsLine = groupedChart(
  () => import("./charts/DriverPointsLine"),
);
const DriverStandingsLine = groupedChart(
  () => import("./charts/DriverStandingsLine"),
);

const F1 = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      <Typography variant="h2" component="h1">
        F1
      </Typography>

      <TimelineCard data={contractData} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6, xxl: 4 }}>
          <ExpandableCard
            title="Constructors"
            backgroundColor={MCLAREN_HEX}
            inverted
          >
            <ChartSection>
              <ConstructorCurrentSpline color={color} />
              <ConstructorPointsLine color={color} />
              <ConstructorStandingsLine color={color} />
            </ChartSection>
          </ExpandableCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6, xxl: 4 }}>
          <ExpandableCard title="Drivers" backgroundColor={RED_BULL_HEX}>
            <ChartSection>
              <DriverCurrentSpline color={color} />
              <DriverPointsLine color={color} />
              <DriverStandingsLine color={color} />
            </ChartSection>
          </ExpandableCard>
        </Grid>

        <Grid size={{ xs: 12, xxl: 4 }}>
          <ExpandableCard
            title="Constructor Budgets (Estimated)"
            backgroundColor={ASTON_HEX}
          >
            <BudgetSankey color={color} />
          </ExpandableCard>
        </Grid>
      </Grid>

      <Tracks />
    </>
  );
};

export default F1;
