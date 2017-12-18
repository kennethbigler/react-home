import React from 'react';
import PropTypes from 'prop-types';
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
  return (
    <RaisedButton label={name} primary={true} style={style} onTouchTap={func} />
  );
};

Button.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  name: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired
};
