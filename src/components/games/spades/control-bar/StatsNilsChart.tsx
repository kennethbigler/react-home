import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { NilMetrics } from "../../../../jotai/spades-atom";

export interface StatsNilChartProps {
  color: string;
  initials: string;
  nils: NilMetrics;
}

const StatsNilChart = memo(({ color, initials, nils }: StatsNilChartProps) => {
  const options = {
    accessibility: { enabled: true },
    chart: {
      type: "column",
      height: 340,
      backgroundColor: null,
    },
    credits: { enabled: false },
    legend: { padding: 0, itemStyle: { color } },
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
        name: "🚫",
        data: nils.map((n) => n[0] - n[1]),
        stack: "Nils",
      },
      {
        name: "🦮",
        data: nils.map((n) => n[1]),
        stack: "Nils",
      },
      {
        name: "🏅",
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
});

StatsNilChart.displayName = "StatsNilChart";

export default StatsNilChart;
