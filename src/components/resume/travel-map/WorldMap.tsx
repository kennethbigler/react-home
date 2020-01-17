import React from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Sphere,
} from 'react-simple-maps';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import Popover from './Popover';
import countries from '../../../constants/countries';

type HandleEnter = (geography: GeographyType) => (evt: React.MouseEvent<SVGPathElement, MouseEvent>) => void;

interface WorldMapHook {
  x: number;
  y: number;
  content: string;
  hide: boolean;
  handleEnter: HandleEnter;
  handleLeave: () => void;
}

interface GeographyType {
  type: 'Feature';
  rsmKey: string;
  svgPath: string;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: [number, number][];
  };
  properties: {
    NAME: string;
    NAME_LONG: string;
    ABBREV: string;
    FORMAL_EN: string;
    POP_EST: number;
    POP_RANK: number;
    GDP_MD_EST: number;
    POP_YEAR: number;
    GDP_YEAR: number;
    ISO_A2: string;
    ISO_A3: string;
    CONTINENT: string;
    REGION_UN: string;
    SUBREGION: string;
  };
}

const STROKE = blueGrey[900];
const HOVER = blueGrey[500];
const VISITED_HOVER = red[800];
const FILL = blueGrey[100];
const PRESSED = blueGrey[800];
const RATIO = 100 / 465.33;

const defaultStyle: React.CSSProperties = {
  stroke: STROKE,
  strokeWidth: 0.75,
  outline: 'none',
};

function useWorldMap(): WorldMapHook {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [content, setContent] = React.useState('');
  const [hide, setHide] = React.useState(true);

  const handleEnter: HandleEnter = (geography) => (evt): void => {
    const name = geography.properties.NAME || '';
    setX(evt.clientX);
    setY(evt.clientY + window.pageYOffset);
    setContent(`${name} ${countries[name] ? countries[name].flag : ''}`);
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

const WorldMap = React.memo(() => {
  const {
    x, y, content, hide,
    handleEnter, handleLeave,
  } = useWorldMap();

  const screenWidth = document.body.clientWidth - 32;

  return (
    <>
      <ComposableMap
        width={screenWidth}
        height={(screenWidth * 546) / 744}
        projectionConfig={{ scale: screenWidth * RATIO }}
      >
        <ZoomableGroup>
          <Sphere id="rsm-sphere" stroke={FILL} strokeWidth={2} fill="transparent" />
          <Geographies geography="/world-110m.json">
            {({ geographies }): React.ReactNodeArray => geographies.map(
              (geo: GeographyType) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={handleEnter(geo)}
                  onMouseLeave={handleLeave}
                  style={{
                    default: {
                      fill: countries[geo.properties.NAME] ? countries[geo.properties.NAME].color : FILL,
                      ...defaultStyle,
                    },
                    hover: {
                      fill: countries[geo.properties.NAME] ? VISITED_HOVER : HOVER,
                      ...defaultStyle,
                    },
                    pressed: {
                      fill: PRESSED,
                      ...defaultStyle,
                    },
                  }}
                />
              ),
            )}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Popover x={x} y={y} hide={hide} content={content} />
    </>
  );
});

export default WorldMap;
