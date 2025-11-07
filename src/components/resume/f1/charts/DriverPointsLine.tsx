import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverPointsData, xAxisYears } from "../../../../constants/f1";
import { driverPointsTooltipFormatter as tooltipFormatter } from "./helpers";

export interface DriverPointsLineProps {
  color: string;
}

const DriverPointsLine = memo(({ color }: DriverPointsLineProps) => {
  const options = {
    accessibility: { enabled: true },
    chart: { type: "line", backgroundColor: null },
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: { series: { marker: { symbol: "circle" } } },
    title: { text: "F1 Drivers Points", style: { color } },
    tooltip: { shared: true, useHTML: true, formatter: tooltipFormatter },
    xAxis: {
      labels: {
        style: { color },
        formatter: function (point: Highcharts.Point): number {
          return xAxisYears[point.value || 0];
        },
      },
    },
    yAxis: {
      max: 600,
      title: { text: undefined },
      labels: { style: { color } },
      gridLineDashStyle: "Dot",
    },
    series: driverPointsData,
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

DriverPointsLine.displayName = "Driver Points";

export default DriverPointsLine;
