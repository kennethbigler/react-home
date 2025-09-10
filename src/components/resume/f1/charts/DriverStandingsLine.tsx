import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { driverStandingsData, xAxisYears } from "../../../../constants/f1";

export interface DriverStandingsLineProps {
  color: string;
}

const tooltipFormatter = function (this: Highcharts.Point): string {
  let tooltip = `Year: <b>${xAxisYears[this.x]}</b><br/>`;

  (this.series.data || []).forEach((point: Highcharts.Point, i: number) => {
    tooltip += point.x === this.x ? "<b>" : "";
    tooltip += !point.y ? "-" : point.y;
    tooltip += point.x === this.x ? "</b>" : "";
    tooltip += i < this.series.data.length - 1 ? ", " : ": ";
  });

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  tooltip += `<span style="color: ${this.color?.toString()};">&#11044;</span> ${this.series.name}<br/>`;

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
      tooltip: { useHTML: true, formatter: tooltipFormatter },
      xAxis: {
        labels: {
          style: { color },
          formatter: function (this: Highcharts.Point): number {
            return xAxisYears[this.value || 0];
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
