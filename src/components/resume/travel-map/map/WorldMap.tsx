import { useState, useEffect, useMemo, memo } from "react";
import { useAtomValue } from "jotai";
import { MapsChart, MapsSeries } from "@highcharts/react/Maps";
import { Credits, Title } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { Typography } from "@mui/material";
import themeAtom from "@/jotai/theme-atom";
import countries, { numCountries } from "@/constants/travel";
import { blue } from "@mui/material/colors";
import LoadingSpinner from "@/components/common/loading-spinner";
import Highcharts from "@/components/common/highcharts/mapsHighcharts";

type MapTooltipPoint = Highcharts.Point & {
  isNull?: boolean;
  flag?: string;
};

const formatTravelTooltip: Highcharts.TooltipFormatterCallbackFunction =
  function () {
    const point = this as MapTooltipPoint;
    const status = point.isNull ? "Not Visited" : point.series.name;
    const detail = point.isNull
      ? point.name
      : `${point.name}: ${point.flag ?? ""}`;
    return `<span style="color:${point.color}">\u25CF</span> <span style="font-size: 0.8em"> ${status}</span><br/>${detail}`;
  };

const staticOptions: Highcharts.Options = {
  chart: { backgroundColor: "transparent", height: "60%" },
  tooltip: { formatter: formatTravelTooltip },
};

const mapSeriesOptions: Highcharts.SeriesMapOptions & {
  nullInteraction: boolean;
} = {
  type: "map",
  name: "Visited",
  states: { hover: { color: blue[100] } },
  joinBy: ["name", "name"],
  showInLegend: false,
  nullColor: blue[900],
  nullInteraction: true,
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
