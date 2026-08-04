import { Grid } from "@mui/material";
import type {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../../jotai/finances-atom";
import usePointSelection from "../../shared/usePointSelection";
import NetWorthChart from "./NetWorthGraph";
import BreakdownChart from "./BreakdownGraph";

interface GraphsProps {
  entries: NetWorthEntry[];
  calcEntries: NetWorthCalcEntry[];
  /** Already sorted by final-entry amounts (largest first). */
  categories: string[];
}

const EMPTY_AMOUNTS: Record<string, number> = {};

const Graphs = ({ entries, calcEntries, categories }: GraphsProps) => {
  const { safeStartIdx, pieIdx, handlePointSelect } = usePointSelection(
    entries.length - 1,
  );

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
        <NetWorthChart
          startIdx={safeStartIdx}
          entries={entries}
          calcEntries={calcEntries}
          categories={categories}
          onPointSelect={handlePointSelect}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
        <BreakdownChart
          categories={categories}
          amounts={entries[pieIdx]?.amounts ?? EMPTY_AMOUNTS}
        />
      </Grid>
    </Grid>
  );
};

export default Graphs;
