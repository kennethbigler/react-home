import React from 'react';
import types from 'prop-types';
import MuiButton from '@material-ui/core/Button';
// Parents: ButtonGroup

/* --------------------------------------------------
 * Button
 * -------------------------------------------------- */

const Button = (props) => {
  const { func, name } = props;

  return (
    <MuiButton
      color="primary"
      onClick={func}
      style={{ margin: 12 }}
      variant="raised"
    >
      {name}
    </MuiButton>
  );
};

Button.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  func: types.func.isRequired,
  name: types.string.isRequired,
};

export default Button;
