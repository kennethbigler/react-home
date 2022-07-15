import React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import useOpenState from "../../../hooks/useOpenState";

interface CopyTextDisplayProps {
  copyText?: string;
  handleCopy: (text: string) => boolean;
  text: string;
}

const chipStyles: React.CSSProperties = {
  height: "auto",
  paddingTop: 7,
  paddingBottom: 7,
};

const CopyTextDisplay: React.FC<CopyTextDisplayProps> = (
  props: CopyTextDisplayProps
) => {
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
      <Chip
        onClick={handleCopyText}
        style={chipStyles}
        label={<div>{text}</div>}
        aria-label={`copy to clipboard ${text}`}
      />
      <Snackbar
        action={[
          <IconButton
            key="close"
            onClick={handleClose}
            size="large"
            aria-label="close copy to clipboard confirmation"
          >
            <CloseIcon />
          </IconButton>,
        ]}
        autoHideDuration={4000}
        message="Copied Commit Text to clipboard!"
        onClose={handleClose}
        open={isOpen}
      />
    </>
  );
};

export default CopyTextDisplay;
