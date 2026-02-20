import { memo } from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "@mui/material/styles";
import {
  Chart,
  Credits,
  Series,
  setHighcharts,
  Title,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/modules/accessibility";
import themeAtom from "../../../jotai/theme-atom";
import { getLieSeries } from "./botcHelpers";

setHighcharts(Highcharts);
interface LiePieProps {
  numPlayers: number;
  numTravelers: number;
  script: number;
}

const staticOptions: Highcharts.Options = {
  chart: {
    type: "pie",
    inverted: true,
    backgroundColor: "transparent",
    style: { marginLeft: "auto", marginRight: "auto" },
  },
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
};

const LiePie = memo(({ numPlayers, numTravelers, script }: LiePieProps) => {
  const muiTheme = useTheme();
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const lieSeries = getLieSeries(numPlayers, numTravelers, script);

  const options: Highcharts.Options = {
    ...staticOptions,
    colors: [
      muiTheme.palette.error.main,
      muiTheme.palette.warning.main,
      muiTheme.palette.info.main,
      muiTheme.palette.success.main,
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Title style={{ color }}>Who is lying?</Title>
        <Series type="pie" options={{ name: "⛽️🔥❓" }} data={lieSeries} />
      </Chart>
    </figure>
  );
});

LiePie.displayName = "LiePie";

export default LiePie;
