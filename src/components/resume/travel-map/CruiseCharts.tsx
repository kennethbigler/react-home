import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import sankey from "highcharts/modules/sankey";
import { useRecoilState } from "recoil";
import themeAtom from "../../../recoil/theme-atom";
import { cruiseData } from "../../../constants/travel";

sankey(Highcharts); // initiate specific module
highchartsMore(Highcharts); // if you module is not in node_modules folder

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
    <div style={{ width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default CruiseCharts;
