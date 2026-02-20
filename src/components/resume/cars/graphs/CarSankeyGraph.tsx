import { memo } from "react";
import {
  Chart,
  Credits,
  Series,
  setHighcharts,
  Title,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import {
  carSankeyNodes,
  carSankeyData,
  kenSankeyData,
  familySankeyData,
} from "../../../../constants/cars";

setHighcharts(Highcharts);

interface CarSankeyGraphProps {
  color: string;
  hideKen: boolean;
  hideFamily: boolean;
}

const options: Highcharts.Options = {
  chart: { type: "sankey", backgroundColor: "transparent" },
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
