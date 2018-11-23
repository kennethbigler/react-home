import React, { Component } from 'react';
import types from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
// Parents: Board

/* ========================================
 * Popup
 * ======================================== */
export default class InfoPopup extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    children: types.oneOfType([types.arrayOf(types.node), types.node]).isRequired,
    title: types.oneOfType([types.string, types.element]).isRequired,
    buttonText: types.oneOfType([types.string, types.element]),
  };

  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { buttonText, title, children } = this.props;
    return (
      <div>
        <Button color="primary" onClick={this.handleOpen} variant="contained">
          {buttonText || title}
        </Button>
        <Dialog onClose={this.handleClose} open={open} maxWidth="md" fullWidth>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogContent>
            {children}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
