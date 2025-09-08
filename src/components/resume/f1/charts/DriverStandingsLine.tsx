import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverStandingsData, xAxisYears } from "../../../../constants/f1";

export interface DriverStandingsLineProps {
  color: string;
}

const tooltipFormatter = function (this: Highcharts.Point): string {
  let tooltip = "Year: <b>" + xAxisYears[this.x] + "</b><br/>";

  (this.points || [])
    .sort((a, b) => Number(a.y) - Number(b.y))
    .forEach((point: Highcharts.Point) => {
      tooltip +=
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        `<b>${point.y}</b>: <span style="color: ${point.series.color?.toString()};">&#11044;</span> ${point.series.name}<br/>`;
    });

  return tooltip;
};

const DriverStandingsLine = React.memo(
  ({ color }: DriverStandingsLineProps) => {
    const options = {
      accessibility: { enabled: true },
      chart: { type: "line", backgroundColor: null },
      credits: { enabled: false },
      legend: { enabled: false },
      title: { text: "F1 Drivers Standings", style: { color } },
      plotOptions: {
        series: {
          lineWidth: 4,
          marker: { radius: 7 },
          dataLabels: {
            enabled: true, // Enable data labels for all series
            format: "{point.name}", // Customize the format if needed
          },
        },
      },
      xAxis: {
        labels: {
          style: { color },
          formatter: function (this: Highcharts.Point): number {
            return xAxisYears[this.value || 0];
          },
        },
      },
      yAxis: {
        tickPositions: [1, 5, 10, 15, 20, 23],
        reversed: true,
        title: { text: undefined },
        labels: { style: { color } },
        gridLineDashStyle: "Dot",
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: tooltipFormatter,
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
