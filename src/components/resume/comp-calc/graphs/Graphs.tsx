import * as React from "react";
import Grid from "@mui/material/Grid2";
import CompChart from "./CompGraph";
import BreakdownChart from "./BreakdownGraph";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../recoil/comp-calculator-state";

interface GraphsProps {
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
}

const Graphs: React.FC<GraphsProps> = ({ compEntries, compCalcEntries }) => (
  <Grid container>
    <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
      <CompChart compCalcEntries={compCalcEntries} compEntries={compEntries} />
    </Grid>
    <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
      <BreakdownChart
        salary={compEntries[compEntries.length - 1].salary}
        bonus={compEntries[compEntries.length - 1].bonus}
        stock={
          compCalcEntries[compCalcEntries.length - 1].stockAdj ||
          compCalcEntries[compCalcEntries.length - 1].stock
        }
      />
    </Grid>
  </Grid>
);

export default Graphs;
