import { memo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
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

const staticOptions: Highcharts.Options = {
  chart: { type: "sankey", backgroundColor: "transparent" },
  credits: { enabled: false },
  title: { text: "Cars" },
  accessibility: {
    enabled: true,
    point: {
      // DEFAULT: {highcharts-id}, from: {point.from}, to: {point.to}, weight: {point.weight}.
      valueDescriptionFormat:
        "{point.to} has {point.weight} from {point.from}.",
    },
  },
  plotOptions: { sankey: { nodeWidth: 70 } }, // Adjust node width for better spacing
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

    const options: Highcharts.Options = {
      ...staticOptions,
      title: { ...staticOptions.title, style: { color } },
      series: [
        {
          name: "Cars",
          type: "sankey",
          keys: ["from", "to", "weight"],
          nodes: carSankeyNodes,
          data,
        },
      ],
    };

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </figure>
    );
  },
);

CarSankeyGraph.displayName = "CarSankeyGraph";

export default CarSankeyGraph;
