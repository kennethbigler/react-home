import { useState, useEffect, memo } from "react";
import { useAtomValue } from "jotai";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/accessibility";
import { Typography } from "@mui/material";
import themeAtom from "../../../../jotai/theme-atom";
import countries, { numCountries } from "../../../../constants/travel";
import { blue } from "@mui/material/colors";

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { backgroundColor: "transparent", height: "60%" },
  credits: { enabled: false },
  series: [
    {
      type: "map",
      name: "Visited",
      states: {
        hover: {
          color: blue[500],
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
  },
};

const WorldMap = memo(() => {
  const [topology, setTopology] = useState<Highcharts.GeoJSON>();
  const [error, setError] = useState(false);
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  // other map: https://code.highcharts.com/mapdata/custom/world.topo.json
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((response) => response.json())
      .then((data) => setTopology(data as Highcharts.GeoJSON))
      .catch(() => setError(true));
  }, []);

  const [options, setOptions] = useState<Highcharts.Options>({
    ...staticOptions,
    chart: { ...staticOptions.chart, map: topology },
    title: { ...staticOptions.title, style: { color } },
  });

  if (
    options?.title?.style?.color !== color ||
    options?.chart?.map !== topology
  ) {
    setOptions({
      ...staticOptions,
      chart: { ...staticOptions.chart, map: topology },
      title: { ...staticOptions.title, style: { color } },
    });
  }

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
});

WorldMap.displayName = "WorldMap";

export default WorldMap;
