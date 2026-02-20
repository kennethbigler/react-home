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
import { driverStandingsData } from "../../../../constants/f1";
import { standingsTTFormatter, xAxisLabelFormatter } from "./helpers";

setHighcharts(Highcharts);

export interface DriverStandingsLineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "line", backgroundColor: "transparent" },
};

const DriverStandingsLine = memo(({ color }: DriverStandingsLineProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Legend enabled={false} />
      <Tooltip useHTML={true} formatter={standingsTTFormatter} />
      <Title style={{ color }}>F1 Drivers Standings</Title>
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
        tickPositions={[1, 5, 10, 15, 20, 24]}
        reversed={true}
        title={{ text: undefined }}
        gridLineDashStyle="Dot"
      />
      <PlotOptions
        series={{ lineWidth: 4, marker: { radius: 5, symbol: "circle" } }}
      />
      {driverStandingsData.map((s) => (
        <Series
          key={s.name}
          options={{ name: s.name, color: s.color }}
          data={s.data}
        />
      ))}
    </Chart>
  </figure>
));

DriverStandingsLine.displayName = "Driver Standings";

export default DriverStandingsLine;
