import { memo } from "react";
import { useAtomValue } from "jotai";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/accessibility";
import themeAtom from "../../../../jotai/theme-atom";
import {
  loyaltySeries,
  loyaltyColors,
  loyaltyNames,
} from "../../../../constants/cruises";

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  colors: loyaltyColors,
  credits: { enabled: false },
  pane: { size: "100%", innerSize: "20%", endAngle: 330 },
  series: loyaltySeries,
  title: { text: "Cruise Loyalty" },
  tooltip: { valueSuffix: "%" },
  chart: {
    type: "column",
    inverted: true,
    polar: true,
    backgroundColor: "transparent",
    style: { marginLeft: "auto", marginRight: "auto" },
  },
  plotOptions: {
    column: {
      stacking: "normal",
      borderWidth: 0,
      pointPadding: 0,
      groupPadding: 0.15,
      borderRadius: "50%",
    },
  },
  yAxis: {
    lineWidth: 0,
    reversedStacks: false,
    gridLineWidth: 0,
    labels: { enabled: false },
  },
};

const LoyaltyCharts = memo(() => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    ...staticOptions,
    legend: { itemStyle: { color } },
    title: { ...staticOptions.title, style: { color } },
    xAxis: {
      labels: {
        align: "right",
        step: 1,
        y: 3,
        style: { color },
      },
      gridLineWidth: 0,
      categories: loyaltyNames,
    },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

LoyaltyCharts.displayName = "LoyaltyCharts";

export default LoyaltyCharts;
