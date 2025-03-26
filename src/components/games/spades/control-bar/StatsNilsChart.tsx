import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";

export interface StatsNilChartProps {
  color: string;
  initials: string;
  nils: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ];
}

const StatsNilChart = React.memo(
  ({ color, initials, nils }: StatsNilChartProps) => {
    const options = {
      chart: {
        type: "column",
        backgroundColor: null,
      },
      credits: { enabled: false },
      legend: { itemStyle: { color } },
      plotOptions: { column: { stacking: "normal", pointPadding: 0 } },
      title: { text: "Nils", style: { color } },
      xAxis: {
        categories: initials.split(""),
        lineColor: color,
        labels: { style: { color } },
      },
      yAxis: {
        floor: 0,
        gridLineDashStyle: "Dot",
        allowDecimals: false,
        title: { text: undefined },
        lineColor: color,
        labels: { style: { color } },
      },
      series: [
        {
          name: "Bid",
          data: nils.map((n) => n[0] - n[1]),
          stack: "Nils",
        },
        {
          name: "Blind",
          data: nils.map((n) => n[1]),
          stack: "Nils",
        },
        {
          name: "Won",
          data: nils.map((n) => n[2]),
          stack: "Wins",
        },
      ],
    };

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </figure>
    );
  },
);

StatsNilChart.displayName = "StatsNilChart";

export default StatsNilChart;
