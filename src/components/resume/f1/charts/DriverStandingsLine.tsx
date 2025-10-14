import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverStandingsData, xAxisYears } from "../../../../constants/f1";
import { standingsTTFormatter } from "./helpers";

export interface DriverStandingsLineProps {
  color: string;
}

const DriverStandingsLine = React.memo(
  ({ color }: DriverStandingsLineProps) => {
    const options = {
      accessibility: { enabled: true },
      chart: { type: "line", backgroundColor: null },
      credits: { enabled: false },
      legend: { enabled: false },
      plotOptions: { series: { marker: { symbol: "circle" } } },
      title: { text: "F1 Drivers Standings", style: { color } },
      tooltip: { useHTML: true, formatter: standingsTTFormatter },
      xAxis: {
        labels: {
          style: { color },
          formatter: function (point: Highcharts.Point): number {
            return xAxisYears[point.value || 0];
          },
        },
      },
      yAxis: {
        tickPositions: [1, 5, 10, 15, 20, 24],
        reversed: true,
        title: { text: undefined },
        labels: { style: { color } },
        gridLineDashStyle: "Dot",
      },
      series: driverStandingsData,
    };

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </figure>
    );
  },
);

DriverStandingsLine.displayName = "Driver Standings";

export default DriverStandingsLine;
