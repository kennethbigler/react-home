import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";

export interface StatsBagsChartProps {
  initials: string;
  lifeBags: [number, number, number, number, number];
  missedBids: [number, number, number, number];
  color: string;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: {
    zooming: { type: "xy" },
    height: 340,
    backgroundColor: "transparent",
  },
  credits: { enabled: false },
  legend: { enabled: false },
  plotOptions: {
    column: { pointPadding: 0 },
    series: { marker: { enabled: false }, lineWidth: 2 },
  },
  title: { text: "Bags" },
  tooltip: { shared: true },
  xAxis: { crosshair: true },
  yAxis: {
    floor: 0,
    gridLineDashStyle: "Dot",
    allowDecimals: false,
    title: { text: undefined },
  },
};

const StatsBagsChart = ({
  initials,
  lifeBags,
  missedBids,
  color,
}: StatsBagsChartProps) => {
  const expBid = Math.round(lifeBags[lifeBags.length - 1]);

  const options: Highcharts.Options = {
    ...staticOptions,
    title: { ...staticOptions.title, style: { color } },
    xAxis: {
      ...staticOptions.xAxis,
      categories: initials.split(""),
      lineColor: color,
      labels: { style: { color } },
    },
    yAxis: {
      ...staticOptions.yAxis,
      lineColor: color,
      labels: { style: { color } },
    },
    series: [
      { name: "💰", type: "column", data: lifeBags.slice(0, -1) },
      { name: "🎰", type: "column", data: missedBids },
      {
        name: "✅",
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
};

export default StatsBagsChart;
