import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { constructorStandingsData, xAxisYears } from "../../../../constants/f1";
import { standingsTTFormatter } from "./helpers";

export interface ConstructorStandingsLineProps {
  color: string;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { type: "line", backgroundColor: "transparent" },
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: "F1 Constructors Standings" },
  tooltip: { useHTML: true, formatter: standingsTTFormatter },
  plotOptions: {
    series: {
      lineWidth: 5,
      marker: { radius: 10, symbol: "circle" },
      dataLabels: {
        enabled: true,
        format: "{y}",
        align: "center",
        verticalAlign: "middle",
      },
    },
  },
  yAxis: {
    tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    endOnTick: false,
    startOnTick: false,
    reversed: true,
    title: { text: undefined },
    gridLineDashStyle: "Dot",
  },
  series: constructorStandingsData,
};

const ConstructorStandingsLine = memo(
  ({ color }: ConstructorStandingsLineProps) => {
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
      yAxis: { ...staticOptions.yAxis, labels: { style: { color } } },
    };

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </figure>
    );
  },
);

ConstructorStandingsLine.displayName = "Constructor Standings";

export default ConstructorStandingsLine;
