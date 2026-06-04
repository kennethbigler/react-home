import { memo } from "react";
import { useAtomValue } from "jotai";
import { Chart, Credits, Series, Title } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../common/highcharts/sankeyHighcharts";
import themeAtom from "../../../../jotai/theme-atom";
import { cruiseData } from "../../../../constants/cruises";

const options: Highcharts.Options = {
  chart: {
    type: "sankey",
    height: 1000,
    backgroundColor: "transparent",
    animation: { duration: 900, easing: "easeInOutSine" },
  },
  plotOptions: {
    sankey: {
      // Nodes
      nodeWidth: 68,
      nodePadding: 16,
      nodeAlignment: "center",
      borderWidth: 0,

      // Links
      linkColorMode: "gradient",
      linkOpacity: 0.45,
      curveFactor: 0.65,
      minLinkWidth: 16, // Doubles as minimum node height — each node is at least 16px tall

      // Node labels
      dataLabels: {
        nodeFormat:
          '{point.name}<br/><span style="font-size:10px;font-weight:normal;opacity:0.8">{point.sum} cruises</span>',
        style: {
          fontSize: "12px",
          fontWeight: "600",
          color: "contrast",
          textOutline: "none",
        },
        padding: 4,
        borderRadius: 2,
      },

      // Tooltip
      tooltip: {
        pointFormat:
          "<b>{point.weight} cruise(s)</b>: {point.fromNode.name} → {point.toNode.name}",
        nodeFormat:
          "<b>{point.name}</b><br/><span style='font-size:11px'>{point.sum} cruises total</span>",
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
            sankey: { nodeWidth: 48 },
          },
        },
      },
    ],
  },
};

const CruiseSankeyGraph = memo(() => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility
          enabled={true}
          point={{
            // DEFAULT: {highcharts-id}, from: {point.from}, to: {point.to}, weight: {point.weight}.
            valueDescriptionFormat:
              "{point.weight} {point.from} cruises have been on {point.to}.",
          }}
        />
        <Credits enabled={false} />
        <Title style={{ color }}>Cruises</Title>
        <Series
          options={{
            name: "Cruises",
            keys: ["from", "to", "weight"],
            nodes: cruiseData.nodes,
          }}
          data={cruiseData.data}
          type="sankey"
        />
      </Chart>
    </figure>
  );
});

CruiseSankeyGraph.displayName = "CruiseSankeyGraph";

export default CruiseSankeyGraph;
