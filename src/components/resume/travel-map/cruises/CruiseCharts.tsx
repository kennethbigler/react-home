import { useAtomValue } from "jotai";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import themeAtom from "../../../../jotai/theme-atom";
import { cruiseData } from "../../../../constants/cruises";

const CruiseCharts = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    chart: {
      type: "sankey",
      height: 600,
      backgroundColor: "transparent",
    },
    credits: { enabled: false },
    title: { text: "Cruises", style: { color } },
    plotOptions: {
      sankey: {
        nodePadding: 20, // Increase padding between nodes
        nodeWidth: 70, // Adjust node width for better spacing
      },
    },
    accessibility: {
      enabled: true,
      point: {
        // DEFAULT: {highcharts-id}, from: {point.from}, to: {point.to}, weight: {point.weight}.
        valueDescriptionFormat:
          "{point.weight} {point.from} cruises have been on {point.to}.",
      },
    },
    series: [
      {
        name: "Cruises",
        type: "sankey",
        keys: ["from", "to", "weight"],
        nodes: [...cruiseData.nodes],
        data: [...cruiseData.data],
      },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default CruiseCharts;
