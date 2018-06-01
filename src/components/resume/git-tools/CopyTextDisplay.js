// react
import React, {Component} from 'react';
import types from 'prop-types';
// material-ui
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
// Parents: Main

export class CopyTextDisplay extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    copyText: types.string,
    handleCopy: types.func.isRequired,
    text: types.oneOfType([types.string, types.array]).isRequired,
  };

  state = {open: false};
  style = {
    paperStyle: {
      padding: 10,
      backgroundColor: grey[300],
      cursor: 'pointer',
      display: 'inline-block',
      borderRadius: 20,
    },
  };

  /** function to toggle the snackbar */
  handleRequestOpen = () => {
    this.setState({open: true});
  };
  handleRequestClose = () => {
    this.setState({open: false});
  };
  /**
   * copies text to clipboard and opens prompt to tell the user
   * @param {Object} e event fired when select occurs
   */
  handleCopy = () => {
    const {handleCopy, copyText, text} = this.props;
    this.handleRequestOpen();
    const toCopy = copyText ? copyText : text;
    handleCopy(toCopy);
  };

  render() {
    const {open} = this.state;
    const {text} = this.props;
    const {paperStyle} = this.style;

    return (
      <div className="copy-text-display">
        <Paper elevation={1} onClick={this.handleCopy} style={paperStyle}>
          {text}
        </Paper>
        <Snackbar
          action={[
            <IconButton
              color="inherit"
              key="close"
              onClick={this.handleRequestClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
          autoHideDuration={4000}
          message="Copied Commit Text to clipboard!"
          onClose={this.handleRequestClose}
          open={open}
        />
      </div>
    );
  }
}
