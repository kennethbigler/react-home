import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";

export interface StatsBagsChartProps {
  initials: string;
  overBids: [number, number, number, number, number];
  color: string;
}

const StatsBagsChart = React.memo(
  ({ initials, overBids, color }: StatsBagsChartProps) => {
    const expBid = Math.round(overBids[overBids.length - 1]);

    const options = {
      chart: {
        zooming: { type: "xy" },
        height: 340,
        backgroundColor: null,
      },
      credits: { enabled: false },
      legend: { enabled: false },
      plotOptions: { series: { marker: { enabled: false }, lineWidth: 2 } },
      title: { text: "Bags", style: { color } },
      tooltip: { shared: true },
      xAxis: {
        crosshair: true,
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
          name: "Bids",
          type: "column",
          data: overBids.slice(0, -1),
        },
        {
          name: "Avg",
          type: "spline",
          data: [expBid, expBid, expBid, expBid],
          color: color,
          lineWidth: 5,
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

StatsBagsChart.displayName = "StatsBagsChart";

export default StatsBagsChart;
