import React, { Component } from 'react';
import { Help } from './help/Help';
import { Rules } from './Rules';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: Board

/** ========================================
 * Popup
 * ======================================== */
export class Popup extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        key="Cancel"
        label="Cancel"
        onClick={this.handleClose}
        primary
      />
    ];

    return (
      <div>
        <RaisedButton
          label="BlackJack Rules"
          onClick={this.handleOpen}
          primary
        />
        <Dialog
          title="Blackjack Rules"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
        >
          <Rules />
          <Help />
        </Dialog>
      </div>
    );
  }
}
