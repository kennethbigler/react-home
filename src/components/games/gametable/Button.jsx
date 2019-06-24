import React, { memo } from 'react';
import types from 'prop-types';
import MuiButton from '@material-ui/core/Button';
// Parents: ButtonGroup

/* --------------------------------------------------
 * Button
 * -------------------------------------------------- */

const Button = memo((props) => {
  const { func, name } = props;

  return (
    <MuiButton
      color="primary"
      onClick={func}
      style={{ margin: 12 }}
      variant="contained"
    >
      {name}
    </MuiButton>
  );
});

Button.propTypes = {
  func: types.func.isRequired,
  name: types.string.isRequired,
};

export default Button;
