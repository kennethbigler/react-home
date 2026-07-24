import { memo } from "react";
import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  Title,
  Tooltip,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../../common/highcharts/coreHighcharts";
import themeAtom from "../../../../../jotai/theme-atom";
import colors from "./colors";
import { BONUS, SALARY, STOCK } from "./compGraphHelpers";

interface BreakdownChartProps {
  bonus: number;
  salary: number;
  stock: number;
}

const options: Highcharts.Options = {
  colors,
  chart: { type: "pie", backgroundColor: "transparent" },
};

const BreakdownChart = memo(({ bonus, salary, stock }: BreakdownChartProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";
  const data = [
    { name: "Stock", y: stock, color: colors[STOCK] },
    { name: "Bonus", y: bonus, color: colors[BONUS] },
    { name: "Salary", y: salary, color: colors[SALARY] },
  ].filter(({ y }) => y > 0);

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>Comp Breakdown</Title>
        <Tooltip pointFormat="<b>${point.y:,.2f}</b>" />
        <PlotOptions
          series={{
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: [
              { enabled: true, format: "{point.name}", color },
              {
                enabled: true,
                distance: -30,
                format: "{point.percentage:.0f}%",
                style: { fontSize: "1em", color },
              } as unknown as Highcharts.DataLabelsOptions,
            ],
          }}
        />
        <Series type="pie" data={data} />
      </Chart>
    </figure>
  );
});

BreakdownChart.displayName = "BreakdownChart";

export default BreakdownChart;
