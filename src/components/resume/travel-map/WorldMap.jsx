import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import map from 'lodash/map';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
  fontFamily: 'Roboto, sans-serif',
};

const STROKE = blueGrey[900];
const HOVER = blueGrey[500];
const FILL = blueGrey[100];
const PRESSED = blueGrey[700];

class WithReduxExample extends Component {
  state = {
    x: 0,
    y: 0,
    hide: true,
    content: '',
  }

  handleMove = (geography, evt) => {
    const x = evt.clientX;
    const y = evt.clientY + window.pageYOffset;
    const content = geography.properties.NAME;
    this.setState({
      hide: false, x, y, content,
    });
  }

  handleLeave = () => {
    this.setState({ hide: true });
  }

  render() {
    const {
      x, y, hide, content,
    } = this.state;
    const popoverStyle = {
      position: 'absolute',
      left: x,
      top: y - 35,
      display: hide ? 'none' : 'block',
      backgroundColor: grey[800],
      color: 'white',
      padding: 5,
    };

    return (
      <div style={wrapperStyles}>
        <ComposableMap>
          <ZoomableGroup>
            <Geographies geography="/world-110m.json">
              {(geographies, projection) => map(geographies, (geography, i) => (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  onMouseMove={this.handleMove}
                  onMouseLeave={this.handleLeave}
                  style={{
                    default: {
                      fill: FILL,
                      stroke: STROKE,
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                    hover: {
                      fill: HOVER,
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
        <div style={popoverStyle}>{content}</div>
      </div>
    );
  }
}

export default WithReduxExample;
