import * as React from "react";
import * as Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { processData, CarStats } from "../../../constants/cars";

highchartsAccessibility(Highcharts); // initiate accessibility module

export interface CarChartProps {
  data: CarStats[];
  color: string;
}

const CarChart = React.memo(({ data, color }: CarChartProps) => {
  const { horsepower, MPG, weight, powerToWeight, xAxis } = processData(data);

  const options = {
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
      { data: horsepower, name: "Horsepower" },
      { data: MPG, name: "MPG" },
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
