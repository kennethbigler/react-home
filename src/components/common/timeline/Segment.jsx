import React, { PureComponent } from 'react';
import types from 'prop-types';
import grey from '@material-ui/core/colors/grey';
import { withTheme } from '@material-ui/core/styles';
// Parents: Row

class Segment extends PureComponent {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    color: types.string,
    body: types.string,
    title: types.string,
    width: types.number.isRequired,
    inverted: types.bool,
    theme: types.shape({
      palette: types.shape({
        primary: types.shape({
          main: types.string.isRequired,
        }).isRequired,
        type: types.string,
      }).isRequired,
    }),
  }

  render() {
    // var for segment
    const {
      body, width, color, title, inverted, theme: { palette: { type } },
    } = this.props;
    // variables for empty segment
    let style = {
      display: 'inline-block',
      width: `${width}%`,
      color: inverted ? 'black' : grey[50],
    };
    if (body) {
      style = {
        ...style,
        cursor: 'default',
        paddingTop: '5px',
        paddingBottom: '5px',
        textAlign: 'center',
        borderRadius: 2,
        backgroundColor: color,
      };

      if (type !== 'dark') {
        style = {
          ...style,
          boxShadow: `2px 3px 4px ${grey[400]}`,
        };
      }
    }

    return (
      <div style={style} title={title}>
        {body || <br />}
      </div>
    );
  }
}

export default withTheme()(Segment);
