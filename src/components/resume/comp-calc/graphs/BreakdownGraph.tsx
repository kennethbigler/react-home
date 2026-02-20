import { memo } from "react";
import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  setHighcharts,
  Title,
  Tooltip,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/modules/accessibility";
import themeAtom from "../../../../jotai/theme-atom";
import colors from "./colors";

setHighcharts(Highcharts);

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
            // @ts-expect-error: types are wrong in @highcharts/react
            dataLabels: [
              { enabled: true, format: "{point.name}", color },
              {
                enabled: true,
                distance: -30,
                format: "{point.percentage:.0f}%",
                style: { fontSize: "1em", color },
              },
            ],
          }}
        />
        <Series
          type="pie"
          data={[
            { name: "Stock", y: stock },
            { name: "Bonus", y: bonus },
            { name: "Salary", y: salary },
          ]}
        />
      </Chart>
    </figure>
  );
});

BreakdownChart.displayName = "BreakdownChart";

export default BreakdownChart;
