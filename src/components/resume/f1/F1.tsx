import Typography from "@mui/material/Typography";
import { useAtomValue } from "jotai";
import Grid from "@mui/material/Grid";
import BudgetSankey from "./charts/BudgetSankey";
import ConstructorPointsLine from "./charts/ConstructorPointsLine";
import ConstructorStandingsLine from "./charts/ConstructorStandingsLine";
import ExpandableCard from "../../common/expandable-card";
import themeAtom from "../../../jotai/theme-atom";
import { constructors } from "../../../constants/f1";
import DriverPointsLine from "./charts/DriverPointsLine";
import DriverStandingsLine from "./charts/DriverStandingsLine";

const F1 = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      <Typography variant="h2" component="h1">
        F1
      </Typography>

      <ExpandableCard
        title="Constructors"
        backgroundColor={constructors[1].color}
      >
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, md: 6 }}>
            <ConstructorPointsLine color={color} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ConstructorStandingsLine color={color} />
          </Grid>
        </Grid>
      </ExpandableCard>

      <ExpandableCard
        inverted
        title="Drivers"
        backgroundColor={constructors[0].color}
      >
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, md: 6 }}>
            <DriverPointsLine color={color} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DriverStandingsLine color={color} />
          </Grid>
        </Grid>
      </ExpandableCard>

      <ExpandableCard
        title="Constructor Budgets (Estimated)"
        backgroundColor={constructors[6].color}
      >
        <BudgetSankey color={color} />
      </ExpandableCard>
    </>
  );
};

export default F1;
