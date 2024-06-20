import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import sankey from "highcharts/modules/sankey";
import highchartsAccessibility from "highcharts/modules/accessibility";
import { carSankeyData } from "../../../constants/cars";

sankey(Highcharts); // initiate sankey module
highchartsMore(Highcharts); // if you module is not in node_modules folder
highchartsAccessibility(Highcharts); // initiate accessibility module

interface CarSankeyGraphProps {
  color: string;
}

const CarSankeyGraph = React.memo(({ color }: CarSankeyGraphProps) => {
  const options: Highcharts.Options = {
    title: {
      text: "Cars",
      style: { color },
    },
    chart: { backgroundColor: "transparent" },
    series: [
      {
        name: "Cars",
        type: "sankey",
        keys: ["from", "to", "weight"],
        nodes: [...carSankeyData.nodes],
        data: [...carSankeyData.data],
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
});

export default CarSankeyGraph;
