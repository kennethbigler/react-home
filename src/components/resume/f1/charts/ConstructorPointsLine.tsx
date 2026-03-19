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
import { constructorPointsData } from "../../../../constants/f1";
import {
  constructorPointsTTFormatter as ttFormatter,
  xAxisLabelFormatter,
} from "./helpers";

export interface ConstructorPointsLineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "line", backgroundColor: "transparent" },
};

const ConstructorPointsLine = memo(({ color }: ConstructorPointsLineProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Legend enabled={false} />
      <Tooltip shared={true} useHTML={true} formatter={ttFormatter} />
      <Title style={{ color }}>F1 Constructors Points</Title>
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
        tickPositions={[0, 150, 300, 450, 600, 750, 860]}
        title={{ text: undefined }}
        gridLineDashStyle="Dot"
      />
      <PlotOptions
        series={{ lineWidth: 4, marker: { radius: 5, symbol: "circle" } }}
      />
      {constructorPointsData.map((s) => (
        <Series
          key={s.name}
          options={{ name: s.name, color: s.color }}
          data={s.data}
        />
      ))}
    </Chart>
  </figure>
));

ConstructorPointsLine.displayName = "Constructor Points";

export default ConstructorPointsLine;
