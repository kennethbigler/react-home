import React, { useState } from 'react';
import types from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
// Parents: Main

const styles = {
  paperStyle: {
    padding: 10,
    backgroundColor: grey[300],
    cursor: 'pointer',
    display: 'inline-block',
    borderRadius: 20,
  },
};

const CopyTextDisplay = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCopy, copyText, text } = props;

  /**
   * copies text to clipboard and opens prompt to tell the user
   * @param {Object} e event fired when select occurs
   */
  const handleCopyText = () => {
    setIsOpen(true);
    const toCopy = copyText || text;
    handleCopy(toCopy);
  };

  return (
    <div>
      <Paper elevation={1} onClick={handleCopyText} style={styles.paperStyle}>
        {text}
      </Paper>
      <Snackbar
        action={[
          <IconButton key="close" onClick={() => { setIsOpen(false); }}>
            <CloseIcon />
          </IconButton>,
        ]}
        autoHideDuration={4000}
        message="Copied Commit Text to clipboard!"
        onClose={() => { setIsOpen(false); }}
        open={isOpen}
      />
    </div>
  );
};

CopyTextDisplay.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  copyText: types.string,
  handleCopy: types.func.isRequired,
  text: types.oneOfType([types.string, types.array]).isRequired,
};

export default CopyTextDisplay;
