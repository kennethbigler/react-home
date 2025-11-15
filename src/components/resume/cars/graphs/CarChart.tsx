import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { processData, CarEntry } from "../../../../constants/cars";

export interface CarChartProps {
  data: CarEntry[];
  color: string;
}

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { type: "spline", backgroundColor: "transparent" },
  credits: { enabled: false },
  legend: { enabled: false },
  plotOptions: { series: { marker: { enabled: false }, lineWidth: 2 } },
  title: { text: "Car Data" },
  tooltip: { valueSuffix: "%" },
  yAxis: {
    floor: 0,
    ceiling: 100,
    gridLineDashStyle: "Dot",
    labels: { enabled: false },
    title: { text: undefined },
  },
};

const CarChart = ({ data, color }: CarChartProps) => {
  const { horsepower, weight, powerToWeight, zTo60, xAxis } = processData(data);

  const options: Highcharts.Options = {
    ...staticOptions,
    title: { ...staticOptions.title, style: { color } },
    xAxis: { categories: xAxis, labels: { style: { color } } },
    series: [
      { data: zTo60, name: "0-60", type: "spline" },
      { data: horsepower, name: "Horsepower", type: "spline" },
      { data: weight, name: "Weight", type: "spline" },
      { data: powerToWeight, name: "Power-to-Weight", type: "spline" },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default CarChart;
