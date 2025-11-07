import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverPointsData, xAxisYears } from "../../../../constants/f1";

export interface DriverPointsLineProps {
  color: string;
}

export const tooltipFormatter = function (this: Highcharts.Point): string {
  let tooltip = "Year: <b>" + xAxisYears[this.x] + "</b><br/>";
  const tooltipHist: Record<number, string> = {};

  (this.points || []).forEach((point: Highcharts.Point) => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const team = `<span style="color: ${point.series.color?.toString()};">&#11044;</span> ${point.series.name}`;
    const i = point.y || 0;

    if (tooltipHist[i] === undefined) {
      tooltipHist[i] = `<b>${point.y}</b>: ${team}`;
    } else {
      tooltipHist[i] += ` / ${team}`;
    }
  });

  Object.keys(tooltipHist)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      tooltip += tooltipHist[Number(key)] + "<br/>";
    });

  return tooltip;
};

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
