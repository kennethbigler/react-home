// React
import React, { useState, Fragment } from 'react';
import types from 'prop-types';
// Material UI
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

const ButtonPopover = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { children, buttonText } = props;
  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <Button
        aria-owns={open ? 'simple-popper' : null}
        aria-haspopup="true"
        variant="contained"
        onClick={(event) => { setAnchorEl(event.currentTarget); }}
      >
        {buttonText}
      </Button>
      <Popover
        id="simple-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={() => { setAnchorEl(null); }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: 15 }}>{React.cloneElement(children)}</div>
      </Popover>
    </Fragment>
  );
};

ButtonPopover.propTypes = {
  children: types.element.isRequired,
  buttonText: types.string.isRequired,
};

export default ButtonPopover;
