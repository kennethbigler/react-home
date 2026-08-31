import { memo } from "react";
import BreakdownPie from "@/components/resume/finances/shared/BreakdownPie";
import { BONUS, SALARY, STOCK, compSeriesColors } from "./compGraphHelpers";

interface BreakdownChartProps {
  bonus: number;
  salary: number;
  stock: number;
}

const BreakdownChart = memo(({ bonus, salary, stock }: BreakdownChartProps) => {
  const data = [
    { name: "Stock", y: Math.max(0, stock), color: compSeriesColors[STOCK] },
    { name: "Bonus", y: Math.max(0, bonus), color: compSeriesColors[BONUS] },
    { name: "Salary", y: Math.max(0, salary), color: compSeriesColors[SALARY] },
  ];

  return (
    <BreakdownPie
      title="Comp Breakdown"
      data={data}
      colors={compSeriesColors}
    />
  );
});

BreakdownChart.displayName = "BreakdownChart";

export default BreakdownChart;
