import { memo } from "react";
import { useAtomValue } from "jotai";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import themeAtom from "../../../../jotai/theme-atom";
import colors from "./colors";

interface BreakdownChartProps {
  bonus: number;
  salary: number;
  stock: number;
}

const BreakdownChart = memo(({ bonus, salary, stock }: BreakdownChartProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options = {
    accessibility: { enabled: true },
    colors,
    chart: { type: "pie", backgroundColor: null },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: "Comp Breakdown", style: { color } },
    tooltip: { pointFormat: "<b>${point.y:,.2f}</b>" },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          { enabled: true, format: "{point.name}" },
          {
            enabled: true,
            distance: -30,
            format: "{point.percentage:.0f}%",
            style: { fontSize: "1em" },
          },
        ],
      },
    },
    series: [
      {
        data: [
          { name: "Stock", y: stock },
          { name: "Bonus", y: bonus },
          { name: "Salary", y: salary },
        ],
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

BreakdownChart.displayName = "BreakdownChart";

export default BreakdownChart;
