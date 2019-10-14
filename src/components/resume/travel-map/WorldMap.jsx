import React, { useState, memo } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import map from 'lodash/map';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import Popover from './Popover';
import countries from '../../../constants/countries';

const STROKE = blueGrey[900];
const HOVER = blueGrey[500];
const VISITED_HOVER = red[800];
const FILL = blueGrey[100];
const PRESSED = blueGrey[800];
const RATIO = 100 / 465.33;

function useWorldMap() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [content, setContent] = useState('');
  const [hide, setHide] = useState(true);

  const handleMove = (geography, evt) => {
    const name = geography.properties.NAME;
    setX(evt.clientX);
    setY(evt.clientY + window.pageYOffset);
    setContent(`${name} ${countries[name] ? countries[name].flag : ''}`);
    setHide(false);
  };

  const handleLeave = () => {
    setHide(true);
  };

  return {
    x,
    y,
    content,
    hide,
    handleMove,
    handleLeave,
  };
}

const WorldMap = memo(() => {
  const {
    x,
    y,
    content,
    hide,
    handleMove,
    handleLeave,
  } = useWorldMap();

  const screenWidth = document.body.clientWidth - 32;

  return (
    <>
      <ComposableMap width={screenWidth} height={(screenWidth * 546) / 744} projectionConfig={{ scale: screenWidth * RATIO, rotation: [-10, 0, 0]}}>
        <ZoomableGroup>
          <Geographies geography="/world-110m.json">
            {(geographies, projection) => map(geographies, (geography, i) => (
              <Geography
                key={i}
                geography={geography}
                projection={projection}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{
                  default: {
                    fill: countries[geography.properties.NAME] ? countries[geography.properties.NAME].color : FILL,
                    stroke: STROKE,
                    strokeWidth: 0.75,
                    outline: 'none',
                  },
                  hover: {
                    fill: countries[geography.properties.NAME] ? VISITED_HOVER : HOVER,
                    stroke: STROKE,
                    strokeWidth: 0.75,
                    outline: 'none',
                  },
                  pressed: {
                    fill: PRESSED,
                    stroke: STROKE,
                    strokeWidth: 0.75,
                    outline: 'none',
                  },
                }}
              />
            ))}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Popover x={x} y={y} hide={hide} content={content} />
    </>
  );
});

export default WorldMap;
