import { useMemo } from "react";
import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../common/highcharts/coreHighcharts";
import themeAtom from "../../../../jotai/theme-atom";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";
import colors from "./colors";
import {
  BONUS,
  INFL,
  SALARY,
  STOCK,
  TOTAL,
  buildCompChartData,
  formatCompTooltip,
} from "./compGraphHelpers";

const staticOptions: Highcharts.Options = {
  chart: { type: "area", backgroundColor: "transparent" },
};

interface CompChartProps {
  startIdx: number;
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
  onClick: Highcharts.SeriesClickCallbackFunction;
}

const CompChart = ({
  startIdx,
  compCalcEntries,
  compEntries,
  onClick,
}: CompChartProps) => {
  // process theme
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const { compChartData, options } = useMemo(() => {
    const chartData = buildCompChartData(
      startIdx,
      compCalcEntries,
      compEntries,
    );

    const chartOptions: Highcharts.Options = {
      ...staticOptions,
      colors: [...colors, color],
      plotOptions: {
        area: {
          stacking: "normal",
          lineColor: color,
          lineWidth: 1,
          marker: { lineWidth: 1, lineColor: color },
        },
      },
    };

    return { compChartData: chartData, options: chartOptions };
  }, [compEntries, compCalcEntries, startIdx, color]);

  const tooltipFormatter = useMemo(() => {
    const finalInflationValue = compChartData[INFL].at(-1);

    return function (this: Highcharts.Point) {
      return formatCompTooltip(this.points || [this], finalInflationValue);
    };
  }, [compChartData]);

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>Total Comp</Title>
        <XAxis visible={false} />
        <YAxis title={{ text: undefined }} labels={{ style: { color } }} />
        <Tooltip shared={true} useHTML={true} formatter={tooltipFormatter} />
        <PlotOptions
          series={{ cursor: "pointer", events: { click: onClick } }}
        />
        <Series
          type="area"
          options={{ name: "Stock" }}
          data={compChartData[STOCK]}
        />
        <Series
          type="area"
          options={{ name: "Bonus" }}
          data={compChartData[BONUS]}
        />
        <Series
          type="area"
          options={{ name: "Salary" }}
          data={compChartData[SALARY]}
        />
        <Series
          type="spline"
          options={{ name: "Total" }}
          data={compChartData[TOTAL]}
        />
        <Series
          type="spline"
          options={{ name: "Inflation" }}
          data={compChartData[INFL]}
        />
      </Chart>
    </figure>
  );
};

export default CompChart;
