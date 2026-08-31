import { useMemo } from "react";
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
import Highcharts from "@/components/common/highcharts/coreHighcharts";
import ChartFigure from "./ChartFigure";
import useChartTextColor from "./useChartTextColor";

interface BreakdownPiePoint {
  name: string;
  y: number;
  color: string;
}

interface BreakdownPieProps {
  title: string;
  data: BreakdownPiePoint[];
  /** Fallback series palette (each point already carries its own color). */
  colors: string[];
  /** Remounts the chart when it changes so removed slices don't linger. */
  chartKey?: string;
}

/** Breakdown pie shared by the comp and net worth graphs. */
const BreakdownPie = ({ title, data, colors, chartKey }: BreakdownPieProps) => {
  const color = useChartTextColor();

  const options = useMemo(
    (): Highcharts.Options => ({
      colors,
      chart: { type: "pie", backgroundColor: "transparent" },
    }),
    [colors],
  );

  return (
    <ChartFigure>
      <Chart key={chartKey} highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>{title}</Title>
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
    </ChartFigure>
  );
};

export default BreakdownPie;
