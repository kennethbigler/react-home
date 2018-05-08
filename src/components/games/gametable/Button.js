import React from 'react';
import types from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: ButtonGroup

/* --------------------------------------------------
 * Button
 * -------------------------------------------------- */

export const Button = (props) => {
  const {func, name} = props;
  const style = {
    margin: 12,
  };
  return <RaisedButton label={name} onClick={func} primary style={style} />;
};

Button.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  func: types.func.isRequired,
  name: types.string.isRequired,
};
