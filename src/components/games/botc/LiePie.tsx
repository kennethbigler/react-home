import { useAtomValue } from "jotai";
import { useTheme } from "@mui/material/styles";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/accessibility";
import themeAtom from "../../../jotai/theme-atom";
import { getLieSeries } from "./botcHelpers";

interface LiePieProps {
  numPlayers: number;
  numTravelers: number;
  script: number;
}

const LiePie = ({ numPlayers, numTravelers, script }: LiePieProps) => {
  const muiTheme = useTheme();
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const lieSeries = getLieSeries(numPlayers, numTravelers, script);

  const options: Highcharts.Options = {
    accessibility: { enabled: true },
    chart: {
      type: "pie",
      inverted: true,
      backgroundColor: "transparent",
      style: { marginLeft: "auto", marginRight: "auto" },
    },
    credits: { enabled: false },
    title: { text: "Do I Trust?", style: { color } },
    plotOptions: {
      pie: {
        dataLabels: [
          { enabled: true, distance: 20, style: { fontSize: "1.2em" } },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: { fontSize: "1.2em" },
          },
        ],
      },
    },
    colors: [
      muiTheme.palette.error.main,
      muiTheme.palette.warning.main,
      muiTheme.palette.info.main,
      muiTheme.palette.success.main,
    ],
    series: [
      {
        type: "pie",
        name: "Do I Trust?",
        data: lieSeries,
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default LiePie;
