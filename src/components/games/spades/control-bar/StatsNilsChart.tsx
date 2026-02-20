import {
  Chart,
  Credits,
  Legend,
  Series,
  setHighcharts,
  Title,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/modules/accessibility";
import { NilMetrics } from "../../../../jotai/spades-atom";

setHighcharts(Highcharts);
export interface StatsNilChartProps {
  color: string;
  initials: string;
  nils: NilMetrics;
}

const options: Highcharts.Options = {
  chart: {
    type: "column",
    height: 340,
    backgroundColor: "transparent",
  },
  plotOptions: { column: { stacking: "normal", pointPadding: 0 } },
};

const StatsNilChart = ({ color, initials, nils }: StatsNilChartProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Title style={{ color }}>Nils</Title>
      <Legend itemStyle={{ color }} padding={0} />
      <XAxis
        categories={initials.split("")}
        lineColor={color}
        // @ts-expect-error: types are wrong in @highcharts/react
        labels={{ style: { color } }}
      />
      <YAxis
        floor={0}
        gridLineDashStyle="Dot"
        allowDecimals={false}
        title={{ text: undefined }}
        lineColor={color}
        // @ts-expect-error: types are wrong in @highcharts/react
        labels={{ style: { color } }}
      />
      <Series
        type="column"
        options={{ name: "🚫", stack: "Nils" }}
        data={nils.map((n) => n[0] - n[1])}
      />
      <Series
        type="column"
        options={{ name: "🦮", stack: "Nils" }}
        data={nils.map((n) => n[1])}
      />
      <Series
        type="column"
        options={{ name: "🏅", stack: "Wins" }}
        data={nils.map((n) => n[2])}
      />
    </Chart>
  </figure>
);

export default StatsNilChart;
