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
import Highcharts from "../../../../common/highcharts/coreHighcharts";
import usDollar from "../../../../../apis/usDollar";
import ChartFigure from "../../shared/ChartFigure";
import useChartTextColor from "../../shared/useChartTextColor";
import type { PiePoint } from "./types";

interface CategoryBreakdownPieProps {
  data: PiePoint[];
  title: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CategoryBreakdownPie = ({ data, title }: CategoryBreakdownPieProps) => {
  const color = useChartTextColor();
  const allowAnimation = !prefersReducedMotion();

  const seriesData = data.map((point) => ({
    ...point,
    yFormatted: usDollar.format(point.y),
  }));

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        animation: allowAnimation,
      },
      plotOptions: {
        pie: { animation: allowAnimation },
      },
    }),
    [allowAnimation],
  );

  return (
    <ChartFigure>
      {/* Remount when selection / hide-taxes changes so the pie re-animates. */}
      <Chart
        key={JSON.stringify({ title, data: seriesData })}
        highcharts={Highcharts}
        options={options}
      >
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>{title}</Title>
        <Tooltip pointFormat="<b>{point.yFormatted}</b>" />
        <PlotOptions
          series={{
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: [
              { format: "{point.name}", color },
              {
                distance: -30,
                format: "{point.percentage:.0f}%",
                style: { fontSize: "1em", color },
              },
            ],
          }}
        />
        <Series type="pie" data={seriesData} />
      </Chart>
    </ChartFigure>
  );
};

export default CategoryBreakdownPie;
