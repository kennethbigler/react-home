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
    chart: { type: "spline", backgroundColor: "transparent" },
    title: { text: "Car Data", style: { color } },
    plotOptions: {
      series: {
        marker: { enabled: false },
        lineWidth: 2,
      },
    },
    tooltip: { valueSuffix: "%" },
    yAxis: {
      floor: 0,
      ceiling: 100,
      gridLineDashStyle: "Dot",
      labels: { enabled: false },
      title: { text: undefined },
    },
    xAxis: { categories: xAxis },
    series: [
      { data: horsepower, showInLegend: false, name: "Horsepower" },
      { data: MPG, showInLegend: false, name: "MPG" },
      { data: weight, showInLegend: false, name: "Weight" },
      { data: powerToWeight, showInLegend: false, name: "Power-to-Weight" },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

export default CarChart;
