import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { chartStandings, standingsXAxisNames } from "../../../../constants/f1";

export interface StandingsProps {
  color: string;
}

const Standings = React.memo(({ color }: StandingsProps) => {
  const options = {
    accessibility: { enabled: true },
    chart: { type: "line", backgroundColor: null },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: "F1 Standings", style: { color } },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true, // Enable data labels for all series
          format: "{point.name}", // Customize the format if needed
        },
      },
    },
    xAxis: {
      title: { text: "Year", style: { color } },
      labels: {
        style: { color },
        formatter: function (): number {
          // @ts-expect-error: this value exists
          return standingsXAxisNames[this.value]; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
        },
      },
    },
    yAxis: {
      min: 1,
      floor: 1,
      ceiling: 10,
      tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      reversed: true,
      gridLineDashStyle: "Dot",
      title: { text: "Position", style: { color } },
      labels: { style: { color } },
    },
    series: chartStandings,
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

Standings.displayName = "Standings";

export default Standings;
