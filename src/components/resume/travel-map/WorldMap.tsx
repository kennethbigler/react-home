import * as React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
} from "react-simple-maps";
import { blueGrey, red } from "@mui/material/colors";
import Popover from "./Popover";
import countries from "../../../constants/travel";

interface GeographyType {
  id: string;
  type: "Feature";
  rsmKey: string;
  svgPath: string;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: [number, number][];
  };
  properties: {
    name: string;
  };
}

type HandleEnter = (
  geography: GeographyType,
) => (evt: React.MouseEvent<SVGPathElement, MouseEvent>) => void;

interface WorldMapHook {
  x: number;
  y: number;
  content: string;
  hide: boolean;
  handleEnter: HandleEnter;
  handleLeave: () => void;
}

const STROKE = blueGrey[900];
const HOVER = blueGrey[500];
const VISITED_HOVER = red[800];
const FILL = blueGrey[100];
const PRESSED = blueGrey[800];
const RATIO = 1 / 4.7;

const defaultStyle: React.CSSProperties = {
  stroke: STROKE,
  strokeWidth: 0.75,
  outline: "none",
};

function useWorldMap(): WorldMapHook {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [content, setContent] = React.useState("");
  const [hide, setHide] = React.useState(true);

  const handleEnter: HandleEnter =
    (geography) =>
    (evt): void => {
      const name = geography.properties.name || "";
      setX(evt.clientX);
      setY(evt.clientY + window.pageYOffset);
      setContent(`${name} ${countries[name] ? countries[name].flag : ""}`);
      setHide(false);
    };

  const handleLeave = (): void => {
    setHide(true);
  };

  return {
    x,
    y,
    content,
    hide,
    handleEnter,
    handleLeave,
  };
}

const WorldMap = () => {
  const { x, y, content, hide, handleEnter, handleLeave } = useWorldMap();

  return (
    <>
      <ComposableMap
        width={5000}
        height={(5000 * 5) / 8}
        projectionConfig={{ scale: 5000 * RATIO }}
      >
        <Sphere
          id="rsm-sphere"
          stroke={FILL}
          strokeWidth={2}
          fill="transparent"
        />
        <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo: GeographyType) => {
              // console.log(geo);
              return (
              <Geography
                key={`${geo.rsmKey}-${geo.id}`}
                geography={geo}
                onMouseEnter={handleEnter(geo)}
                onMouseLeave={handleLeave}
                style={{
                  default: {
                    fill: countries[geo.properties.name]
                      ? countries[geo.properties.name].color
                      : FILL,
                    ...defaultStyle,
                  },
                  hover: {
                    fill: countries[geo.properties.name]
                      ? VISITED_HOVER
                      : HOVER,
                    ...defaultStyle,
                  },
                  pressed: {
                    fill: PRESSED,
                    ...defaultStyle,
                  },
                }}
              />
            )})
          }
        </Geographies>
      </ComposableMap>
      <Popover x={x} y={y} hide={hide} content={content} />
    </>
  );
};

export default WorldMap;
