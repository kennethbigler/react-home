import * as React from "react";
import * as Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { useRecoilState, useRecoilValue } from "recoil";
import { compChartReadOnlyState } from "../../../recoil/comp-calculator-state";
import themeAtom from "../../../recoil/theme-atom";

highchartsAccessibility(Highcharts); // initiate accessibility module

const CompChart = () => {
  const compChartData = useRecoilValue(compChartReadOnlyState);
  const [theme] = useRecoilState(themeAtom);

  const color = theme.mode === "light" ? "black" : "white";

  const [options, setOptions] = React.useState({
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
  });

  React.useEffect(() => {
    setOptions((o) => ({
      ...o,
      series: [
        { name: "Stock", data: [...compChartData[0]] },
        { name: "Bonus", data: [...compChartData[1]] },
        { name: "Salary", data: [...compChartData[2]] },
      ],
    }));
  }, [compChartData]);

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default CompChart;
