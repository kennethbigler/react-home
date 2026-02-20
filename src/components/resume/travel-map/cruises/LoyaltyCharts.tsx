import { memo } from "react";
import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
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
import themeAtom from "../../../../jotai/theme-atom";
import {
  loyaltySeries,
  loyaltyColors,
  loyaltyNames,
} from "../../../../constants/cruises";

setHighcharts(Highcharts);

const options: Highcharts.Options = {
  colors: loyaltyColors,
  pane: { size: "100%", innerSize: "20%", endAngle: 330 },
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
};

const LoyaltyCharts = memo(() => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend itemStyle={{ color }} />
        <Tooltip valueSuffix="%" />
        <Title style={{ color }}>Cruise Loyalty</Title>
        <XAxis
          labels={{
            align: "right",
            step: 1,
            y: 3,
            // @ts-expect-error: types are wrong in @highcharts/react
            style: { color },
          }}
          gridLineWidth={0}
          categories={loyaltyNames}
        />
        <YAxis
          lineWidth={0}
          reversedStacks={false}
          gridLineWidth={0}
          labels={{ enabled: false }}
        />
        {loyaltySeries.map((s) => (
          <Series key={s.name} {...s} options={{ name: s.name }} />
        ))}
      </Chart>
    </figure>
  );
});

LoyaltyCharts.displayName = "LoyaltyCharts";

export default LoyaltyCharts;
