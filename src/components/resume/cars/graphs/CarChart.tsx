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
import { processData, CarEntry } from "../../../../constants/cars";

setHighcharts(Highcharts);

export interface CarChartProps {
  data: CarEntry[];
  color: string;
}

const options: Highcharts.Options = {
  chart: { type: "spline", backgroundColor: "transparent" },
};

const CarChart = ({ data, color }: CarChartProps) => {
  const { horsepower, weight, powerToWeight, zTo60, xAxis } = processData(data);

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Tooltip valueSuffix="%" />
        <Title style={{ color }}>Car Data</Title>
        <XAxis
          categories={xAxis}
          // @ts-expect-error: types are wrong in @highcharts/react
          labels={{ style: { color } }}
        />
        <YAxis
          title={{ text: undefined }}
          floor={0}
          ceiling={100}
          gridLineDashStyle="Dot"
          labels={{ enabled: false }}
        />
        <PlotOptions series={{ marker: { enabled: false }, lineWidth: 2 }} />
        <Series type="spline" options={{ name: "0-60" }} data={zTo60} />
        <Series
          type="spline"
          options={{ name: "Horsepower" }}
          data={horsepower}
        />
        <Series type="spline" options={{ name: "Weight" }} data={weight} />
        <Series
          type="spline"
          options={{ name: "Power-to-Weight" }}
          data={powerToWeight}
        />
      </Chart>
    </figure>
  );
};

export default CarChart;
