import { memo } from "react";
import { useAtomValue } from "jotai";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/accessibility";
import themeAtom from "../../../jotai/theme-atom";
import { vacationDays, workDays } from "../../../constants/travel";

const staticOptions: Highcharts.Options = {
  chart: { type: "areaspline", backgroundColor: "transparent" },
  credits: { enabled: false },
  title: { text: "Travel Days" },
  accessibility: { enabled: true },
  legend: { enabled: false },
  plotOptions: {
    series: { pointStart: 2020 },
    areaspline: { stacking: "normal" },
  },
  tooltip: {
    shared: true,
    headerFormat: "<b>{point.key}</b><br>",
  },
  series: [
    { name: "Vacation", data: vacationDays, type: "areaspline" },
    { name: "Work", data: workDays, type: "areaspline" },
  ],
};

const TravelDaysGraph = memo(() => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    ...staticOptions,
    title: { ...staticOptions.title, style: { color } },
    xAxis: {
      ...staticOptions.xAxis,
      labels: { style: { color } },
    },
    yAxis: {
      ...staticOptions.yAxis,
      title: { text: "Days", style: { color } },
      labels: { style: { color } },
    },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

TravelDaysGraph.displayName = "TravelDaysGraph";

export default TravelDaysGraph;
