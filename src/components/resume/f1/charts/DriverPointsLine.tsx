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
import { driverPointsData } from "../../../../constants/f1";
import {
  driverPointsTooltipFormatter as tooltipFormatter,
  xAxisLabelFormatter,
} from "./helpers";

setHighcharts(Highcharts);

export interface DriverPointsLineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "line", backgroundColor: "transparent" },
};

const DriverPointsLine = memo(({ color }: DriverPointsLineProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Legend enabled={false} />
      <Tooltip shared={true} useHTML={true} formatter={tooltipFormatter} />
      <Title style={{ color }}>F1 Drivers Points</Title>
      <XAxis
        max={7} // TODO: March 8th - remove after first points
        labels={{
          // @ts-expect-error: types are wrong in @highcharts/react
          style: { color },
          formatter: xAxisLabelFormatter,
        }}
      />
      <YAxis
        // @ts-expect-error: types are wrong in @highcharts/react
        labels={{ style: { color } }}
        max={600}
        title={{ text: undefined }}
        gridLineDashStyle="Dot"
      />
      <PlotOptions series={{ lineWidth: 3, marker: { symbol: "circle" } }} />
      {driverPointsData.map((s) => (
        <Series
          key={s.name}
          options={{ name: s.name, color: s.color }}
          data={s.data}
        />
      ))}
    </Chart>
  </figure>
));

DriverPointsLine.displayName = "Driver Points";

export default DriverPointsLine;
