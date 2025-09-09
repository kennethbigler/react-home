import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { constructorStandingsData, xAxisYears } from "../../../../constants/f1";

export interface ConstructorStandingsLineProps {
  color: string;
}

const tooltipFormatter = function (this: Highcharts.Point): string {
  let tooltip = "Year: <b>" + xAxisYears[this.x] + "</b><br/>";
  const tooltipHist = ["", "", "", "", "", "", "", "", "", ""];

  (this.points || []).forEach((point: Highcharts.Point) => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const team = `<span style="color: ${point.series.color?.toString()};">&#11044;</span> ${point.series.name}`;
    const i = point.y ? point.y - 1 : 0;
    tooltipHist[i] +=
      tooltipHist[i] === "" ? `<b>${point.y}</b>: ${team}` : ` (${team})`;
  });

  tooltipHist.forEach((hist) => {
    tooltip += hist + "<br/>";
  });

  return tooltip;
};

const ConstructorStandingsLine = React.memo(
  ({ color }: ConstructorStandingsLineProps) => {
    const options = {
      accessibility: { enabled: true },
      chart: { type: "line", backgroundColor: null },
      credits: { enabled: false },
      legend: { enabled: false },
      title: { text: "F1 Constructors Standings", style: { color } },
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
        tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
      series: constructorStandingsData,
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
