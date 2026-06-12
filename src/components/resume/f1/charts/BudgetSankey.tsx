import { memo } from "react";
import { Chart, Credits, Series, Title } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../common/highcharts/sankeyHighcharts";
import { budgetData } from "../../../../constants/f1";

interface BudgetSankeyProps {
  color: string;
}

const options: Highcharts.Options = {
  chart: {
    type: "sankey",
    height: 920,
    backgroundColor: "transparent",
    // Smooth entrance animation
    animation: { duration: 900, easing: "easeInOutSine" },
  },
  plotOptions: {
    sankey: {
      // Nodes
      nodeWidth: 88, // Default for sm and above; overridden to 60 on xs via responsive rules
      nodePadding: 16, // More breathing room between nodes in the same column
      borderWidth: 0, // Borderless nodes look cleaner against colored fills

      // Links
      linkColorMode: "gradient", // Links fade from source color → destination color
      linkOpacity: 0.45, // Semi-transparent: flows are visible without overpowering nodes
      curveFactor: 0.65, // Slightly tighter curves than the default 0.6
      minLinkWidth: 6, // Keep low-value links visible rather than hairline/invisible

      // Node labels
      dataLabels: {
        // Show the node name and its total dollar flow on two lines
        nodeFormat:
          '{point.name}<br/><span style="font-size:10px;font-weight:normal;opacity:0.8">${point.sum}M</span>',
        style: {
          fontSize: "12px",
          fontWeight: "600",
          // "contrast" picks black/white automatically based on node color — keep it
          color: "contrast",
          // Remove Highcharts' default white text-halo; it looks muddy on colored nodes
          textOutline: "none",
        },
        padding: [4],
        borderRadius: 2,
      },

      // Tooltip
      tooltip: {
        pointFormat:
          "<b>${point.weight}M</b>: {point.fromNode.name} → {point.toNode.name}",
        nodeFormat:
          "<b>{point.name}</b><br/><span style='font-size:11px'>${point.sum}M total</span>",
      },
    },
  },
  // Responsive override: MUI xs breakpoint (0–600px) → narrower nodes
  responsive: {
    rules: [
      {
        condition: { maxWidth: 600 },
        chartOptions: {
          plotOptions: {
            sankey: { nodeWidth: 60 },
          },
        },
      },
    ],
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
