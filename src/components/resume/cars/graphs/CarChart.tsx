import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { processData, CarEntry } from "../../../../constants/cars";

export interface CarChartProps {
  data: CarEntry[];
  color: string;
}

const CarChart = memo(({ data, color }: CarChartProps) => {
  const { horsepower, weight, powerToWeight, zTo60, xAxis } = processData(data);

  const options = {
    accessibility: { enabled: true },
    chart: { type: "spline", backgroundColor: null },
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: { series: { marker: { enabled: false }, lineWidth: 2 } },
    title: { text: "Car Data", style: { color } },
    tooltip: { valueSuffix: "%" },
    xAxis: { categories: xAxis, labels: { style: { color } } },
    yAxis: {
      floor: 0,
      ceiling: 100,
      gridLineDashStyle: "Dot",
      labels: { enabled: false },
      title: { text: undefined },
    },
    series: [
      { data: zTo60, name: "0-60" },
      { data: horsepower, name: "Horsepower" },
      { data: weight, name: "Weight" },
      { data: powerToWeight, name: "Power-to-Weight" },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

CarChart.displayName = "CarChart";

export default CarChart;
