// React
import React from 'react';
import types from 'prop-types';
// Material UI
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

class SimplePopover extends React.Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    children: types.element.isRequired,
    buttonText: types.string.isRequired,
  };

  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { children, buttonText } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <Button
          aria-owns={open ? 'simple-popper' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={this.handleClick}
        >
          {buttonText}
        </Button>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
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
      </div>
    );
  }
}

export default SimplePopover;
