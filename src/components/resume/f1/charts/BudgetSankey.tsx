import { memo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import { budgetData } from "../../../../constants/f1";

interface BudgetSankeyProps {
  color: string;
}

const BudgetSankey = memo(({ color }: BudgetSankeyProps) => {
  const options: Highcharts.Options = {
    chart: {
      type: "sankey",
      height: 800,
      backgroundColor: "transparent",
    },
    credits: { enabled: false },
    title: { text: "Budget", style: { color } },
    plotOptions: {
      sankey: {
        nodeWidth: 80, // Adjust node width for better spacing
        tooltip: {
          pointFormat:
            "<b>${point.weight}m</b>: {point.fromNode.name} → {point.toNode.name}",
          nodeFormat: "<b>${point.sum}m</b>: {point.name}",
        },
      },
    },
    series: [
      {
        name: "Budget",
        type: "sankey",
        keys: ["from", "to", "weight"],
        nodes: [...budgetData.nodes],
        data: [...budgetData.data],
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
});

BudgetSankey.displayName = "BudgetSankey";

export default BudgetSankey;
