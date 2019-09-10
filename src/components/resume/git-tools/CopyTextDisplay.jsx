import React, { useState, Fragment } from 'react';
import types from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
// Parents: Main

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
    <Fragment>
      <Chip elevation={1} onClick={handleCopyText} label={text} />
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
    </Fragment>
  );
};

CopyTextDisplay.propTypes = {
  copyText: types.string,
  handleCopy: types.func.isRequired,
  text: types.oneOfType([types.string, types.array]).isRequired,
};

export default CopyTextDisplay;
