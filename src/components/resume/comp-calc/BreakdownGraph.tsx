import * as React from "react";
import * as Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { useRecoilState } from "recoil";
import themeAtom from "../../../recoil/theme-atom";

highchartsAccessibility(Highcharts); // initiate accessibility module

interface BreakdownChartProps {
  bonus: number;
  salary: number;
  stock: number;
}

const BreakdownChart: React.FC<BreakdownChartProps> = ({
  bonus,
  salary,
  stock,
}) => {
  const [theme] = useRecoilState(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options = {
    chart: { type: "pie", backgroundColor: null },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: "Comp Breakdown", style: { color } },
    tooltip: { pointFormat: "<b>${point.y}</b>" },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          { enabled: true, format: "{point.name}" },
          {
            enabled: true,
            distance: -30,
            format: "{point.percentage:.0f}%",
            style: { fontSize: "1em" },
          },
        ],
      },
    },
    series: [
      {
        data: [
          { name: "Stock", y: stock },
          { name: "Bonus", y: bonus },
          { name: "Salary", y: salary },
        ],
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default BreakdownChart;
