import { memo } from "react";
import {
  Chart,
  Credits,
  Series,
  setHighcharts,
  Title,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import { budgetData } from "../../../../constants/f1";

setHighcharts(Highcharts);

interface BudgetSankeyProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: {
    type: "sankey",
    height: 800,
    backgroundColor: "transparent",
  },
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
};

const BudgetSankey = memo(({ color }: BudgetSankeyProps) => (
  <figure style={{ margin: 0, width: "100%" }}>
    <Chart highcharts={Highcharts} options={options}>
      <Accessibility enabled={true} />
      <Credits enabled={false} />
      <Title style={{ color }}>Budget</Title>
      <Series
        options={{
          name: "Budget",
          keys: ["from", "to", "weight"],
          nodes: budgetData.nodes,
        }}
        data={budgetData.data}
        type="sankey"
      />
    </Chart>
  </figure>
));

BudgetSankey.displayName = "BudgetSankey";

export default BudgetSankey;
