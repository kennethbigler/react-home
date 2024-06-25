import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import sankey from "highcharts/modules/sankey";
import highchartsAccessibility from "highcharts/modules/accessibility";
import { useRecoilState } from "recoil";
import themeAtom from "../../../recoil/theme-atom";
import { cruiseData } from "../../../constants/travel";

sankey(Highcharts); // initiate sankey module
highchartsMore(Highcharts); // if you module is not in node_modules folder
highchartsAccessibility(Highcharts); // initiate accessibility module

const CruiseCharts = () => {
  const [theme] = useRecoilState(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const options: Highcharts.Options = {
    title: {
      text: "Cruises",
      style: { color },
    },
    chart: { backgroundColor: "transparent" },
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
