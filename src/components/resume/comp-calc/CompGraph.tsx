import * as Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { useRecoilValue } from "recoil";
import { compChartReadOnlyState } from "../../../recoil/comp-calculator-state";

highchartsAccessibility(Highcharts); // initiate accessibility module

const CompChart = () => {
  const compChartData = useRecoilValue(compChartReadOnlyState);

  const options = {
    chart: { type: "area" },
    title: { text: "Total Comp" },
    plotOptions: {
      series: { pointStart: 2012 },
      area: {
        stacking: "normal",
        lineColor: "#666666",
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: "#666666",
        },
      },
    },
    series: compChartData,
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default CompChart;
