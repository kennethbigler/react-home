import { useState, useEffect, memo } from "react";
import { useAtomValue } from "jotai";
import { MapsChart, MapsSeries } from "@highcharts/react/Maps";
import { Credits, setHighcharts, Title } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highmaps.src";
import "highcharts/modules/accessibility";
import { Typography } from "@mui/material";
import themeAtom from "../../../../jotai/theme-atom";
import countries, { numCountries } from "../../../../constants/travel";
import { blue } from "@mui/material/colors";

setHighcharts(Highcharts);

const staticOptions: Highcharts.Options = {
  chart: { backgroundColor: "transparent", height: "60%" },
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
  });

  if (options?.chart?.map !== topology) {
    setOptions({
      ...staticOptions,
      chart: { ...staticOptions.chart, map: topology },
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
      <MapsChart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Title style={{ color }}>
          Travel Map: {numCountries} Countries Visited
        </Title>
        <MapsSeries
          type="map"
          options={{
            name: "Visited",
            states: {
              hover: {
                color: blue[500],
              },
            },
            joinBy: ["name", "name"],
            showInLegend: false,
            tooltip: { pointFormat: "{point.name}: {point.flag}" },
          }}
          data={countries}
        />
      </MapsChart>
    </figure>
  );
});

WorldMap.displayName = "WorldMap";

export default WorldMap;
