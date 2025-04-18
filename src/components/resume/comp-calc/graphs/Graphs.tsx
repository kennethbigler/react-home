import * as React from "react";
import Grid from "@mui/material/Grid";
import { SeriesClickEventObject } from "highcharts";
import CompChart from "./CompGraph";
import BreakdownChart from "./BreakdownGraph";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";

interface GraphsProps {
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
}

const Graphs = ({ compEntries, compCalcEntries }: GraphsProps) => {
  const { stock, stockAdj } = compCalcEntries[compCalcEntries.length - 1];
  const { bonus, salary } = compEntries[compEntries.length - 1];

  const [startIdx, setStartIdx] = React.useState(0);
  const [cStock, setStock] = React.useState(stockAdj || stock);
  const [cBonus, setBonus] = React.useState(bonus);
  const [cSalary, setSalary] = React.useState(salary);

  React.useEffect(() => {
    setStartIdx(0);
    setStock(stockAdj || stock);
    setBonus(bonus);
    setSalary(salary);
  }, [stockAdj, stock, bonus, salary]);

  const handleClick = ({ point: { index } }: SeriesClickEventObject) => {
    const { stock, stockAdj } = compCalcEntries[index];
    const { bonus, salary } = compEntries[index];
    setStartIdx(index >= compEntries.length - 1 ? 0 : index);
    setStock(stockAdj || stock);
    setBonus(bonus);
    setSalary(salary);
  };

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
        <CompChart
          startIdx={startIdx}
          compCalcEntries={compCalcEntries}
          compEntries={compEntries}
          onClick={handleClick}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
        <BreakdownChart stock={cStock} bonus={cBonus} salary={cSalary} />
      </Grid>
    </Grid>
  );
};

export default Graphs;
