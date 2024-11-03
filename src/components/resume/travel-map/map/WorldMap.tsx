import * as React from "react";
// Import Highcharts
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
// Import to change title color
import { useRecoilState } from "recoil";
import Typography from "@mui/material/Typography";
import themeAtom from "../../../../recoil/theme-atom";
import countries, { numCountries } from "../../../../constants/travel";

highchartsAccessibility(Highcharts);

const WorldMap = () => {
  const [topology, setTopology] = React.useState<Highcharts.GeoJSON>();
  const [error, setError] = React.useState(false);
  const [theme] = useRecoilState(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  // other map: https://code.highcharts.com/mapdata/custom/world.topo.json
  React.useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((response) => response.json())
      .then((data) => setTopology(data as Highcharts.GeoJSON))
      .catch(() => setError(true));
  }, []);

  const [options, setOptions] = React.useState<Highcharts.Options>({});

  React.useEffect(() => {
    setOptions({
      chart: { backgroundColor: "transparent", map: topology, height: "60%" },
      credits: { enabled: false },
      series: [
        {
          type: "map",
          name: "Visited",
          states: {
            hover: {
              color: "#BADA55",
            },
          },
          joinBy: ["name", "name"],
          data: countries,
          showInLegend: false,
          tooltip: { pointFormat: "{point.name}: {point.flag}" },
        },
      ],
      title: {
        text: `Travel Map: ${numCountries} Countries Visited`,
        style: { color },
      },
    });
  }, [color, topology]);

  if (error) {
    return (
      <Typography variant="h3">
        Map failed to load. {numCountries} Countries Visited.
      </Typography>
    );
  }
  if (!topology) {
    return <Typography variant="h3">Loading World Map...</Typography>;
  }

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType="mapChart"
        options={options}
      />
    </figure>
  );
};

export default WorldMap;
