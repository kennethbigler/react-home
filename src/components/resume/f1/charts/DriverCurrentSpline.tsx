import { memo } from "react";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "./f1Highcharts";
import { driverCurrentData } from "../../../../constants/f1";
import { currentPointsTTFormatter as ttFormatter } from "./helpers";

export interface DriverCurrentSplineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "spline", backgroundColor: "transparent" },
};

const DriverCurrentSpline = memo(({ color }: DriverCurrentSplineProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Legend enabled={false} />
      <Tooltip shared={true} useHTML={true} formatter={ttFormatter} />
      <Title style={{ color }}>F1 2026 Drivers Points</Title>
      <XAxis
        // @ts-expect-error: types are wrong in @highcharts/react
        labels={{ style: { color } }}
      />
      <YAxis
        // @ts-expect-error: types are wrong in @highcharts/react
        labels={{ style: { color } }}
        title={{ text: undefined }}
        gridLineDashStyle="Dot"
      />
      <PlotOptions
        series={{
          lineWidth: 3,
          marker: { enabled: false, symbol: "circle", radius: 3 },
        }}
      />
      {driverCurrentData.map((s) => (
        <Series
          key={s.name}
          options={{ name: s.name, color: s.color }}
          data={s.data}
          type="spline"
        />
      ))}
    </Chart>
  </figure>
));

DriverCurrentSpline.displayName = "Driver Points";

export default DriverCurrentSpline;
