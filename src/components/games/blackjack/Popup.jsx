import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Rules from './Rules';
import Help from './help';
// Parents: Board

/* ========================================
 * Popup
 * ======================================== */
export default class Popup extends Component {
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
    return (
      <div>
        <Button color="primary" onClick={this.handleOpen} variant="contained">
          BlackJack Rules
        </Button>
        <Dialog onClose={this.handleClose} open={open}>
          <DialogTitle>
            Blackjack Rules
          </DialogTitle>
          <DialogContent>
            <Rules />
            <Help />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
