import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverStandingsData, xAxisYears } from "../../../../constants/f1";
import { standingsTTFormatter } from "./helpers";

export interface DriverStandingsLineProps {
  color: string;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { type: "line", backgroundColor: "transparent" },
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: "F1 Drivers Standings" },
  tooltip: { useHTML: true, formatter: standingsTTFormatter },
  plotOptions: {
    series: {
      lineWidth: 4,
      marker: { radius: 5, symbol: "circle" },
    },
  },
  yAxis: {
    tickPositions: [1, 5, 10, 15, 20, 24],
    reversed: true,
    title: { text: undefined },
    gridLineDashStyle: "Dot",
  },
  series: driverStandingsData,
};

const DriverStandingsLine = memo(({ color }: DriverStandingsLineProps) => {
  const options: Highcharts.Options = {
    ...staticOptions,
    title: { ...staticOptions.title, style: { color } },
    tooltip: { useHTML: true, formatter: standingsTTFormatter },
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

DriverStandingsLine.displayName = "Driver Standings";

export default DriverStandingsLine;
