import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { constructorPointsData, xAxisYears } from "../../../../constants/f1";

export interface ConstructorPointsLineProps {
  color: string;
}

const tooltipFormatter = function (this: Highcharts.Point): string {
  let tooltip = "Year: <b>" + xAxisYears[this.x] + "</b><br/>";
  const tooltipHist: Record<number, string> = {};

  (this.points || []).forEach((point: Highcharts.Point) => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const team = `<span style="color: ${point.series.color?.toString()};">&#11044;</span> ${point.series.name}`;
    const i = point.y || 0;

    if (tooltipHist[i] === undefined) {
      tooltipHist[i] = `<b>${point.y}</b>: ${team}`;
    } else {
      tooltipHist[i] += ` (${team})`;
    }
  });

  Object.keys(tooltipHist)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      tooltip += tooltipHist[Number(key)] + "<br/>";
    });

  return tooltip;
};

const ConstructorPointsLine = React.memo(
  ({ color }: ConstructorPointsLineProps) => {
    const options = {
      accessibility: { enabled: true },
      chart: { type: "line", backgroundColor: null },
      credits: { enabled: false },
      legend: { enabled: false },
      plotOptions: { series: { marker: { symbol: "circle" } } },
      title: { text: "F1 Constructors Points", style: { color } },
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
        tickPositions: [0, 150, 300, 450, 600, 750, 860],
        title: { text: undefined },
        labels: { style: { color } },
        gridLineDashStyle: "Dot",
      },
      series: constructorPointsData,
    };

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </figure>
    );
  },
);

ConstructorPointsLine.displayName = "Constructor Points";

export default ConstructorPointsLine;
