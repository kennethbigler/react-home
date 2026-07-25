import { useState } from "react";
import { Grid } from "@mui/material";
import CompChart from "./CompGraph";
import BreakdownChart from "./BreakdownGraph";
import type {
  CompCalcEntry,
  CompEntry,
} from "../../../../../jotai/finances-atom";

interface GraphsProps {
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
}

const Graphs = ({ compEntries, compCalcEntries }: GraphsProps) => {
  const [startIdx, setStartIdx] = useState(0);
  // null = follow the latest entry until the user selects a point
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handlePointSelect = (index: number) => {
    setStartIdx(index);
    setSelectedIdx(index);
  };

  if (compEntries.length === 0 || compCalcEntries.length === 0) {
    return null;
  }

  const lastIdx = compEntries.length - 1;
  const safeStartIdx = Math.min(startIdx, lastIdx);
  const pieIdx = Math.min(selectedIdx ?? lastIdx, lastIdx);
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
