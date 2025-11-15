import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverPointsData, xAxisYears } from "../../../../constants/f1";
import { driverPointsTooltipFormatter as tooltipFormatter } from "./helpers";

export interface DriverPointsLineProps {
  color: string;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { type: "line", backgroundColor: "transparent" },
  credits: { enabled: false },
  legend: { enabled: false },
  plotOptions: { series: { marker: { symbol: "circle" } } },
  title: { text: "F1 Drivers Points" },
  tooltip: { shared: true, useHTML: true, formatter: tooltipFormatter },
  yAxis: {
    max: 600,
    title: { text: undefined },
    gridLineDashStyle: "Dot",
  },
  series: driverPointsData,
};

const DriverPointsLine = memo(({ color }: DriverPointsLineProps) => {
  const options: Highcharts.Options = {
    ...staticOptions,
    title: { ...staticOptions.title, style: { color } },
    // @ts-expect-error: types are wrong in highcharts-react-official
    xAxis: {
      labels: {
        style: { color },
        formatter: function (point: Highcharts.Point): number {
          return xAxisYears[point.value || 0];
        },
      },
    },
    yAxis: {
      ...staticOptions.yAxis,
      labels: { style: { color } },
    },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

DriverPointsLine.displayName = "Driver Points";

export default DriverPointsLine;
