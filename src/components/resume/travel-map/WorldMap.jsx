import React, { useState, memo } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import map from 'lodash/map';
import blueGrey from '@material-ui/core/colors/blueGrey';
import {
  amber, blue, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow,
} from '@material-ui/core/colors/';
import Popover from './Popover';


const STROKE = blueGrey[900];
const HOVER = blueGrey[500];
const VISITED_HOVER = red[800];
const FILL = blueGrey[100];
const PRESSED = blueGrey[800];
const RATIO = 100 / 465.33;

const countries = {
  Bahamas: amber[500],
  Canada: blue[500],
  Mexico: brown[500],
  'United States of America': cyan[500],
  Austria: deepOrange[500],
  Denmark: deepPurple[500],
  Estonia: green[500],
  Finland: indigo[500],
  France: lightBlue[500],
  Germany: lightGreen[500],
  Greece: lime[500],
  Iceland: orange[500],
  Ireland: pink[500],
  Italy: purple[500],
  Netherlands: red[500],
  Norway: teal[500],
  Portugal: yellow[500],
  Russia: amber[800],
  Spain: blue[800],
  Sweden: cyan[800],
  Switzerland: deepOrange[800],
  Turkey: deepPurple[800],
  'United Kingdom': green[800],
};

function useWorldMap() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [content, setContent] = useState('');
  const [hide, setHide] = useState(true);

  const handleMove = (geography, evt) => {
    setX(evt.clientX);
    setY(evt.clientY + window.pageYOffset);
    setContent(geography.properties.NAME);
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
    <div>
      <ComposableMap width={screenWidth} height={screenWidth * 546 / 744} projectionConfig={{ scale: screenWidth * RATIO, rotation: [-10, 0, 0] }}>
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
                    fill: countries[geography.properties.NAME] ? countries[geography.properties.NAME] : FILL,
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
            ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Popover x={x} y={y} hide={hide} content={content} />
    </div>
  );
});

export default WorldMap;
