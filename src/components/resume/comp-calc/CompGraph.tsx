import * as React from "react";
import * as Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { useRecoilState } from "recoil";
import themeAtom from "../../../recoil/theme-atom";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../recoil/comp-calculator-state";

highchartsAccessibility(Highcharts); // initiate accessibility module

const STOCK = 0;
const BONUS = 1;
const SALARY = 2;

interface CompChartProps {
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
}

const CompChart: React.FC<CompChartProps> = ({
  compCalcEntries,
  compEntries,
}) => {
  const [theme] = useRecoilState(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const compChartData: number[][] = [[], [], []];
  compEntries.forEach((cEntry, i) => {
    compChartData[STOCK].push(compCalcEntries[i].stockAdj);
    compChartData[BONUS].push(cEntry.bonus);
    compChartData[SALARY].push(cEntry.salary);
  });

  const options = {
    chart: { type: "area", backgroundColor: null },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: "Total Comp", style: { color } },
    xAxis: { visible: false },
    yAxis: { labels: { style: { color } }, title: { enabled: false } },
    tooltip: { shared: true, headerFormat: "<h3>Compensation</h3><br />" },
    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: color,
        lineWidth: 1,
        marker: { lineWidth: 1, lineColor: color },
      },
    },
    series: [
      { name: "Stock", data: [...compChartData[0]] },
      { name: "Bonus", data: [...compChartData[1]] },
      { name: "Salary", data: [...compChartData[2]] },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default CompChart;