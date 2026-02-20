import { memo } from "react";
import { useAtomValue } from "jotai";
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
import themeAtom from "../../../../jotai/theme-atom";
import { cruiseData } from "../../../../constants/cruises";

setHighcharts(Highcharts);

const options: Highcharts.Options = {
  chart: {
    type: "sankey",
    height: 800,
    backgroundColor: "transparent",
  },
  plotOptions: {
    sankey: {
      nodePadding: 16, // Increase padding between nodes
      nodeWidth: 68, // Adjust node width for better spacing
    },
  },
};

const CruiseCharts = memo(() => {
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

CruiseCharts.displayName = "CruiseCharts";

export default CruiseCharts;
