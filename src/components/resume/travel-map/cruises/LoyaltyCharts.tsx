import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import { useRecoilState } from "recoil";
import themeAtom from "../../../../recoil/theme-atom";
import { loyaltySeries, loyaltyColors } from "../../../../constants/cruises";

highchartsAccessibility(Highcharts); // initiate accessibility module

const LoyaltyCharts = () => {
  const [theme] = useRecoilState(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    colors: loyaltyColors,
    credits: { enabled: false },
    pane: { innerSize: "20%", endAngle: 335 },
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
      tickInterval: 5,
      reversedStacks: false,
      endOnTick: true,
      showLastLabel: true,
      gridLineWidth: 0,
      labels: { format: "{text}%", style: { color } },
    },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default LoyaltyCharts;
