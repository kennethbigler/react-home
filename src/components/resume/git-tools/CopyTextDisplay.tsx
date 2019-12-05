import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import useOpenState from '../../../hooks/useOpenState';

interface CopyTextDisplayProps {
  copyText?: string;
  handleCopy: Function;
  text: string | React.ReactNode[];
}

const chipStyles: React.CSSProperties = { height: 'auto', paddingTop: 7, paddingBottom: 7 };

const CopyTextDisplay: React.FC<CopyTextDisplayProps> = (props: CopyTextDisplayProps) => {
  const [isOpen, handleOpen, handleClose] = useOpenState(false);
  const { handleCopy, copyText, text } = props;

  /** copies text to clipboard and opens prompt to tell the user */
  const handleCopyText = React.useCallback((): void => {
    handleOpen();
    const toCopy = copyText || text;
    handleCopy(toCopy);
  }, [copyText, handleCopy, handleOpen, text]);

  return (
    <>
      <Chip onClick={handleCopyText} style={chipStyles} label={<div>{text}</div>} />
      <Snackbar
        action={[
          <IconButton key="close" onClick={handleClose as React.MouseEventHandler}>
            <CloseIcon />
          </IconButton>,
        ]}
        autoHideDuration={4000}
        message="Copied Commit Text to clipboard!"
        onClose={handleClose as React.ReactEventHandler}
        open={isOpen}
      />
    </>
  );
};

export default CopyTextDisplay;
