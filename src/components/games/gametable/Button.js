import React from 'react';
import types from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: ButtonGroup

/* --------------------------------------------------
 * Button
 * -------------------------------------------------- */

export const Button = props => {
  const { func, name } = props;
  const style = {
    margin: 12
  };
  return <RaisedButton label={name} style={style} onClick={func} primary />;
};

Button.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  name: types.string.isRequired,
  func: types.func.isRequired
};
