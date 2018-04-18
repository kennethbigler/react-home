// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// material-ui
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
// Parents: Main

export class CopyTextDisplay extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    handleCopy: PropTypes.func.isRequired,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    copyText: PropTypes.string
  };

  state = { open: false };
  style = { chipLabel: { lineHeight: null, paddingTop: 6, paddingBottom: 6 } };

  /** function to toggle the snackbar */
  handleRequestOpen = () => this.setState({ open: true });
  handleRequestClose = () => this.setState({ open: false });
  /**
   * copies text to clipboard and opens prompt to tell the user
   * @param {Object} e event fired when select occurs
   */
  handleCopy = () => {
    const { handleCopy, copyText, text } = this.props;
    this.handleRequestOpen();
    const toCopy = copyText ? copyText : text;
    handleCopy(toCopy);
  };

  render() {
    const { open } = this.state;
    const { text } = this.props;
    const { chipLabel } = this.style;

    return (
      <div className="copy-text-display">
        <Chip labelStyle={chipLabel} onClick={this.handleCopy}>
          {text}
        </Chip>
        <Snackbar
          open={open}
          message="Copied Commit Text to clipboard!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}
