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
import { constructorCurrentData } from "../../../../constants/f1";
import { currentPointsTTFormatter as ttFormatter } from "./helpers";

setHighcharts(Highcharts);

export interface ConstructorCurrentSplineProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "spline", backgroundColor: "transparent" },
};

const ConstructorCurrentSpline = memo(
  ({ color }: ConstructorCurrentSplineProps) => (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Tooltip shared={true} useHTML={true} formatter={ttFormatter} />
        <Title style={{ color }}>F1 2026 Constructors Points</Title>
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
        <PlotOptions series={{ lineWidth: 4, marker: { enabled: false } }} />
        {constructorCurrentData.map((s) => (
          <Series
            key={s.name}
            options={{ name: s.name, color: s.color }}
            data={s.data}
            type="spline"
          />
        ))}
      </Chart>
    </figure>
  ),
);

ConstructorCurrentSpline.displayName = "Constructor Points";

export default ConstructorCurrentSpline;
