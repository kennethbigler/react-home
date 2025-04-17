import { useAtomValue } from "jotai";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/accessibility";
import themeAtom from "../../../../jotai/theme-atom";
import { loyaltySeries, loyaltyColors } from "../../../../constants/cruises";

const LoyaltyCharts = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    accessibility: { enabled: true },
    colors: loyaltyColors,
    credits: { enabled: false },
    pane: { size: "100%", innerSize: "20%", endAngle: 330 },
    legend: { itemStyle: { color } },
    series: loyaltySeries,
    title: { text: "Cruise Loyalty", style: { color } },
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
    xAxis: {
      labels: {
        align: "right",
        step: 1,
        y: 3,
        style: { color },
      },
      gridLineWidth: 0,
      categories: [
        "Disney 🛳️",
        "Virgin 🛳️",
        "Princess 🛳️",
        "Princess 🌙",
        "Royal 🌙",
      ],
    },
    yAxis: {
      lineWidth: 0,
      reversedStacks: false,
      gridLineWidth: 0,
      labels: { enabled: false },
    },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default LoyaltyCharts;
