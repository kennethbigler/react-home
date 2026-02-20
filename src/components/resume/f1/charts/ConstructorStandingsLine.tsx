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
import { constructorStandingsData } from "../../../../constants/f1";
import { standingsTTFormatter, xAxisLabelFormatter } from "./helpers";

setHighcharts(Highcharts);

export interface ConstructorStandingsLineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "line", backgroundColor: "transparent" },
};

const ConstructorStandingsLine = memo(
  ({ color }: ConstructorStandingsLineProps) => (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Tooltip useHTML={true} formatter={standingsTTFormatter} />
        <Title style={{ color }}>F1 Constructors Standings</Title>
        <XAxis
          labels={{
            // @ts-expect-error: types are wrong in @highcharts/react
            style: { color },
            formatter: xAxisLabelFormatter,
          }}
        />
        <YAxis
          // @ts-expect-error: types are wrong in @highcharts/react
          labels={{ style: { color } }}
          tickPositions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
          endOnTick={false}
          startOnTick={false}
          reversed={true}
          title={{ text: undefined }}
          gridLineDashStyle="Dot"
        />
        <PlotOptions
          series={{
            lineWidth: 5,
            marker: { radius: 10, symbol: "circle" },
            dataLabels: {
              enabled: true,
              format: "{y}",
              align: "center",
              verticalAlign: "middle",
            },
          }}
        />
        {constructorStandingsData.map((s) => (
          <Series
            key={s.name}
            options={{ name: s.name, color: s.color }}
            data={s.data}
          />
        ))}
      </Chart>
    </figure>
  ),
);

ConstructorStandingsLine.displayName = "Constructor Standings";

export default ConstructorStandingsLine;
