import { Grid } from "@mui/material";
import type {
  CompCalcEntry,
  CompEntry,
} from "../../../../../jotai/finances-atom";
import usePointSelection from "../../shared/usePointSelection";
import CompChart from "./CompGraph";
import BreakdownChart from "./BreakdownGraph";

interface GraphsProps {
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
}

const Graphs = ({ compEntries, compCalcEntries }: GraphsProps) => {
  const { safeStartIdx, pieIdx, handlePointSelect } = usePointSelection(
    compEntries.length - 1,
  );

  if (compEntries.length === 0 || compCalcEntries.length === 0) {
    return null;
  }

  const { stock, stockAdj } = compCalcEntries[pieIdx];
  const { bonus, salary } = compEntries[pieIdx];

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
        <CompChart
          startIdx={safeStartIdx}
          compCalcEntries={compCalcEntries}
          compEntries={compEntries}
          onPointSelect={handlePointSelect}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
        <BreakdownChart
          stock={stockAdj || stock}
          bonus={bonus}
          salary={salary}
        />
      </Grid>
    </Grid>
  );
};

export default Graphs;
