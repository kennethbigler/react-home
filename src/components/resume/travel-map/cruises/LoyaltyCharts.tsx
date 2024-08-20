import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import { useRecoilState } from "recoil";
import { amber, red, grey, blueGrey } from "@mui/material/colors";
import themeAtom from "../../../../recoil/theme-atom";
// import { cruiseData } from "../../../../constants/travel";

highchartsAccessibility(Highcharts); // initiate accessibility module

const LoyaltyCharts = () => {
  const [theme] = useRecoilState(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    colors: [
      red[100],
      grey[400],
      amber[500],
      blueGrey[900],
      grey[50],
      "transparent",
    ],
    chart: {
      type: "column",
      inverted: true,
      polar: true,
      backgroundColor: "transparent",
    },
    title: {
      text: "Cruise Loyalty",
      style: { color },
    },
    tooltip: {
      outside: true,
      valueSuffix: "%",
    },
    pane: {
      size: "85%",
      innerSize: "20%",
      endAngle: 335,
    },
    xAxis: {
      tickInterval: 1,
      labels: {
        align: "right",
        useHTML: true,
        allowOverlap: true,
        step: 1,
        y: 3,
        style: { color },
      },
      lineWidth: 0,
      gridLineWidth: 0,
      categories: [
        "Disney 🛳️",
        "Royal 🌙",
        "Princess 🛳️",
        "Princess 🌙",
        "Virgin 🛳️",
      ],
    },
    yAxis: {
      lineWidth: 0,
      tickInterval: 5,
      reversedStacks: false,
      endOnTick: true,
      showLastLabel: true,
      gridLineWidth: 0,
      labels: { style: { color } },
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
    series: [
      {
        type: "column",
        name: "None",
        data: [
          Math.floor((1 / 30) * 100),
          Math.floor((3 / 30) * 100),
          Math.floor((1 / 3) * 100),
          Math.floor((1 / 30) * 100),
          Math.floor((1 / 2) * 100),
        ],
      },
      {
        type: "column",
        name: "Silver",
        data: [Math.floor((4 / 30) * 100), 0, 0, 0, 0],
      },
      {
        type: "column",
        name: "Gold",
        data: [
          Math.floor((5 / 30) * 100),
          Math.floor((1 / 30) * 100),
          0,
          Math.floor((3 / 30) * 100),
          0,
        ],
      },
      {
        type: "column",
        name: "Platinum",
        data: [Math.floor((15 / 30) * 100), 0, 0, 0, 0],
      },
      {
        type: "column",
        name: "Pearl",
        data: [Math.floor((5 / 30) * 100), 0, 0, 0, 0],
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default LoyaltyCharts;
