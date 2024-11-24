import * as React from "react";
import Grid from "@mui/material/Grid2";
import CompChart from "./CompGraph";
import BreakdownChart from "./BreakdownGraph";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../recoil/comp-calculator-state";
import { SeriesClickEventObject } from "highcharts";

interface GraphsProps {
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
}

const Graphs: React.FC<GraphsProps> = ({ compEntries, compCalcEntries }) => {
  const { stock, stockAdj } = compCalcEntries[compCalcEntries.length - 1];
  const { bonus, salary } = compEntries[compEntries.length - 1];

  const [cStock, setStock] = React.useState(stockAdj || stock);
  const [cBonus, setBonus] = React.useState(bonus);
  const [cSalary, setSalary] = React.useState(salary);

  React.useEffect(() => {
    setStock(stockAdj || stock);
    setBonus(bonus);
    setSalary(salary);
  }, [stockAdj, stock, bonus, salary]);

  const handleClick = (e: SeriesClickEventObject) => {
    const { stock, stockAdj } = compCalcEntries[e.point.index];
    const { bonus, salary } = compEntries[e.point.index];
    setStock(stockAdj || stock);
    setBonus(bonus);
    setSalary(salary);
  };

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>
        <CompChart
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
