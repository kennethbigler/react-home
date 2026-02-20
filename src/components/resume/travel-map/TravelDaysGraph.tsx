import { memo } from "react";
import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  setHighcharts,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/modules/accessibility";
import themeAtom from "../../../jotai/theme-atom";
import { vacationDays, workDays } from "../../../constants/travel";

setHighcharts(Highcharts);

const options: Highcharts.Options = {
  chart: { type: "areaspline", backgroundColor: "transparent" },
  plotOptions: { areaspline: { stacking: "normal" } },
};

const TravelDaysGraph = memo(() => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Tooltip shared={true} headerFormat="<b>{point.key}</b><br>" />
        <Title style={{ color }}>Travel Days</Title>
        <PlotOptions series={{ pointStart: 2020 }} />
        {/* @ts-expect-error: types are wrong in @highcharts/react */}
        <XAxis labels={{ style: { color } }} />
        <YAxis
          // @ts-expect-error: types are wrong in @highcharts/react
          labels={{ style: { color } }}
          // @ts-expect-error: types are wrong in @highcharts/react
          title={{ style: { color } }}
        >
          Days
        </YAxis>
        <Series
          type="areaspline"
          options={{ name: "Vacation" }}
          data={vacationDays}
        />
        <Series type="areaspline" options={{ name: "Work" }} data={workDays} />
      </Chart>
    </figure>
  );
});

TravelDaysGraph.displayName = "TravelDaysGraph";

export default TravelDaysGraph;
