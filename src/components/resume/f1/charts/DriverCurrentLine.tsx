import { memo } from "react";
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
import { driverCurrentData } from "../../../../constants/f1";
import { currentPointsTTFormatter as ttFormatter } from "./helpers";

setHighcharts(Highcharts);

export interface DriverCurrentLineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "line", backgroundColor: "transparent" },
};

const DriverCurrentLine = memo(({ color }: DriverCurrentLineProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Legend enabled={false} />
      <Tooltip shared={true} useHTML={true} formatter={ttFormatter} />
      <Title style={{ color }}>F1 Drivers Points</Title>
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
        series={{ lineWidth: 4, marker: { radius: 5, symbol: "circle" } }}
      />
      {driverCurrentData.map((s) => (
        <Series
          key={s.name}
          options={{ name: s.name, color: s.color }}
          data={s.data}
        />
      ))}
    </Chart>
  </figure>
));

DriverCurrentLine.displayName = "Driver Points";

export default DriverCurrentLine;
