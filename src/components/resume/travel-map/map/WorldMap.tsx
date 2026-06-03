import { useState, useEffect, useMemo, memo } from "react";
import { useAtomValue } from "jotai";
import { MapsChart, MapsSeries } from "@highcharts/react/Maps";
import { Credits, setHighcharts, Title } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "highcharts/highmaps.src";
import "highcharts/modules/accessibility";
import { Typography } from "@mui/material";
import themeAtom from "../../../../jotai/theme-atom";
import countries, { numCountries } from "../../../../constants/travel";
import { blue } from "@mui/material/colors";
import LoadingSpinner from "../../../common/loading-spinner";

setHighcharts(Highcharts);

const staticOptions: Highcharts.Options = {
  chart: { backgroundColor: "transparent", height: "60%" },
};

const mapSeriesOptions: Highcharts.SeriesMapOptions = {
  type: "map",
  name: "Visited",
  states: { hover: { color: blue[500] } },
  joinBy: ["name", "name"],
  showInLegend: false,
  tooltip: { pointFormat: "{point.name}: {point.flag}" },
};

const WorldMap = memo(() => {
  const [topology, setTopology] = useState<Highcharts.GeoJSON>();
  const [error, setError] = useState(false);
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  useEffect(() => {
    const controller = new AbortController();
    // other map: https://code.highcharts.com/mapdata/custom/world.topo.json
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json", {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => setTopology(data as Highcharts.GeoJSON))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(true);
        }
      });
    return () => controller.abort();
  }, []);

  const options = useMemo<Highcharts.Options>(
    () => ({
      ...staticOptions,
      chart: { ...staticOptions.chart, map: topology },
    }),
    [topology],
  );

  if (error) {
    return (
      <Typography variant="h3">
        Map failed to load. {numCountries} Countries Visited.
      </Typography>
    );
  }
  if (!topology) {
    return <LoadingSpinner />;
  }

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <MapsChart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Title style={{ color }}>
          Travel Map: {numCountries} Countries Visited
        </Title>
        <MapsSeries type="map" options={mapSeriesOptions} data={countries} />
      </MapsChart>
    </figure>
  );
});

WorldMap.displayName = "WorldMap";

export default WorldMap;
