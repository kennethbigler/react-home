import Typography from "@mui/material/Typography";
import StandingsLine from "./charts/StandingsLine";
import { useAtomValue } from "jotai";
import themeAtom from "../../../jotai/theme-atom";
import BudgetSankey from "./charts/BudgetSankey";
import PointsLine from "./charts/PointsLine";
import ExpandableCard from "../../common/expandable-card";
import Grid from "@mui/material/Grid";
import { teams } from "../../../constants/f1";

const F1 = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      <Typography variant="h2" component="h1">
        F1
      </Typography>

      <ExpandableCard title="F1 Constructors" backgroundColor={teams[1].color}>
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, md: 6 }}>
            <PointsLine color={color} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StandingsLine color={color} />
          </Grid>
        </Grid>
      </ExpandableCard>

      {/* // TODO: Add driver data */}
      <ExpandableCard
        inverted
        title="F1 Drivers"
        backgroundColor={teams[0].color}
      >
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, md: 6 }}>
            <PointsLine color={color} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StandingsLine color={color} />
          </Grid>
        </Grid>
      </ExpandableCard>

      <ExpandableCard
        title="F1 Team Budgets (Estimated)"
        backgroundColor={teams[6].color}
      >
        <BudgetSankey color={color} />
      </ExpandableCard>
    </>
  );
};

export default F1;
