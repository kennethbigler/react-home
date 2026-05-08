import { memo } from "react";
import { Chart, Credits, Series, Title, XAxis, YAxis } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "./carsHighcharts";
import {
  carSankeyNodes,
  carSankeyData,
  kenSankeyData,
  familySankeyData,
} from "../../../../constants/cars";

interface CarSankeyGraphProps {
  color: string;
  hideKen: boolean;
  hideFamily: boolean;
}

const options: Highcharts.Options = {
  chart: {
    type: "sankey",
    height: 600,
    backgroundColor: "transparent",
    animation: { duration: 900, easing: "easeInOutSine" },
  },
  plotOptions: {
    sankey: {
      // Nodes
      nodeWidth: 70,
      nodePadding: 14,
      nodeAlignment: "center",
      borderWidth: 0,

      // Links
      linkColorMode: "gradient",
      linkOpacity: 0.45,
      curveFactor: 0.65,
      minLinkWidth: 2, // Flows of 1 car would otherwise be a hairline

      // Node labels
      dataLabels: {
        nodeFormat:
          '{point.name}<br/><span style="font-size:10px;font-weight:normal;opacity:0.8">{point.sum} cars</span>',
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
          "<b>{point.weight} car(s)</b>: {point.fromNode.name} → {point.toNode.name}",
        nodeFormat:
          "<b>{point.name}</b><br/><span style='font-size:11px'>{point.sum} cars total</span>",
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
            sankey: { nodeWidth: 50 },
          },
        },
      },
    ],
  },
};

const CarSankeyGraph = memo(
  ({ color, hideKen, hideFamily }: CarSankeyGraphProps) => {
    let data = carSankeyData;
    if (hideKen && hideFamily) {
      data = [];
    } else if (hideKen) {
      data = familySankeyData;
    } else if (hideFamily) {
      data = kenSankeyData;
    }

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <Chart highcharts={Highcharts} options={options}>
          <Accessibility
            enabled={true}
            point={{
              // DEFAULT: {highcharts-id}, from: {point.from}, to: {point.to}, weight: {point.weight}.
              valueDescriptionFormat:
                "{point.to} has {point.weight} from {point.from}.",
            }}
          />
          <Credits enabled={false} />
          <Title style={{ color }}>Cars</Title>
          <XAxis visible={false} />
          <YAxis visible={false} />
          <Series
            options={{
              name: "Cars",
              keys: ["from", "to", "weight"],
              nodes: carSankeyNodes,
            }}
            data={data}
            type="sankey"
          />
        </Chart>
      </figure>
    );
  },
);

CarSankeyGraph.displayName = "CarSankeyGraph";

export default CarSankeyGraph;
