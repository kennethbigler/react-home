import { memo, useMemo } from "react";
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
import { buildNetWorthBreakdownPieData } from "./buildNetWorthBreakdownPieData";

interface BreakdownChartProps {
  categories: string[];
  amounts: Record<string, number>;
}

const options: Highcharts.Options = {
  colors,
  chart: { type: "pie", backgroundColor: "transparent" },
};

const BreakdownChart = memo(({ categories, amounts }: BreakdownChartProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";
  const data = useMemo(
    () => buildNetWorthBreakdownPieData(categories, amounts),
    [categories, amounts],
  );

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart
        key={JSON.stringify(data)}
        highcharts={Highcharts}
        options={options}
      >
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>Net Worth Breakdown</Title>
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
              },
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
