import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { constructorPointsData, xAxisYears } from "../../../../constants/f1";
import { constructorPointsTooltipFormatter as tooltipFormatter } from "./helpers";

export interface ConstructorPointsLineProps {
  color: string;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { type: "line", backgroundColor: "transparent" },
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: "F1 Constructors Points" },
  tooltip: { shared: true, useHTML: true, formatter: tooltipFormatter },
  plotOptions: {
    series: {
      lineWidth: 4,
      marker: { radius: 5, symbol: "circle" },
    },
  },
  yAxis: {
    tickPositions: [0, 150, 300, 450, 600, 750, 860],
    title: { text: undefined },
    gridLineDashStyle: "Dot",
  },
  series: constructorPointsData,
};

const ConstructorPointsLine = memo(({ color }: ConstructorPointsLineProps) => {
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
      max: 7, // TODO: March 8th - remove after first points
    },
    yAxis: { ...staticOptions.yAxis, labels: { style: { color } } },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

ConstructorPointsLine.displayName = "Constructor Points";

export default ConstructorPointsLine;
