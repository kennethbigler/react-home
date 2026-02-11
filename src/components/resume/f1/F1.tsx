import { Typography, Grid } from "@mui/material";
import { useAtomValue } from "jotai";
import BudgetSankey from "./charts/BudgetSankey";
import ConstructorPointsLine from "./charts/ConstructorPointsLine";
import ConstructorStandingsLine from "./charts/ConstructorStandingsLine";
import ExpandableCard from "../../common/expandable-card";
import themeAtom from "../../../jotai/theme-atom";
import {
  RED_BULL_HEX,
  MCLAREN_HEX,
  ASTON_HEX,
  contractData,
} from "../../../constants/f1";
import DriverPointsLine from "./charts/DriverPointsLine";
import DriverStandingsLine from "./charts/DriverStandingsLine";
import Tracks from "./Tracks";
import TimelineCard from "./timeline-card/TimelineCard";

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
          <ExpandableCard title="Constructors" backgroundColor={MCLAREN_HEX}>
            <ConstructorPointsLine color={color} />
            <ConstructorStandingsLine color={color} />
          </ExpandableCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6, xxl: 4 }}>
          <ExpandableCard title="Drivers" backgroundColor={RED_BULL_HEX}>
            <DriverPointsLine color={color} />
            <DriverStandingsLine color={color} />
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
