import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { constructorPointsData, xAxisYears } from "../../../../constants/f1";
import { constructorPointsTooltipFormatter as tooltipFormatter } from "./helpers";

export interface ConstructorPointsLineProps {
  color: string;
}

const ConstructorPointsLine = memo(({ color }: ConstructorPointsLineProps) => {
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
});

ConstructorPointsLine.displayName = "Constructor Points";

export default ConstructorPointsLine;
