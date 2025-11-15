import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { NilMetrics } from "../../../../jotai/spades-atom";

export interface StatsNilChartProps {
  color: string;
  initials: string;
  nils: NilMetrics;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: {
    type: "column",
    height: 340,
    backgroundColor: "transparent",
  },
  credits: { enabled: false },
  legend: { padding: 0 },
  plotOptions: { column: { stacking: "normal", pointPadding: 0 } },
  title: { text: "Nils" },
  yAxis: {
    floor: 0,
    gridLineDashStyle: "Dot",
    allowDecimals: false,
    title: { text: undefined },
  },
};

const StatsNilChart = ({ color, initials, nils }: StatsNilChartProps) => {
  const options: Highcharts.Options = {
    ...staticOptions,
    legend: { ...staticOptions.legend, itemStyle: { color } },
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
      {
        name: "🚫",
        data: nils.map((n) => n[0] - n[1]),
        stack: "Nils",
        type: "column",
      },
      {
        name: "🦮",
        data: nils.map((n) => n[1]),
        stack: "Nils",
        type: "column",
      },
      {
        name: "🏅",
        data: nils.map((n) => n[2]),
        stack: "Wins",
        type: "column",
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default StatsNilChart;
