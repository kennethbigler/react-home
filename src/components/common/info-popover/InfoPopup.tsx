import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { MuiColors } from "../types";

interface InfoPopupProps {
  /** popup content */
  children: React.ReactNode | React.ReactNode[];
  /** title content */
  title: string | React.ReactElement;
  /** button content */
  buttonText?: string | React.ReactElement;
  /** set the color of the button */
  buttonColor?: MuiColors;
  /** set the color of the button */
  onSave?: () => void;
}

const InfoPopup = ({
  buttonText,
  title,
  children,
  buttonColor,
  onSave,
}: InfoPopupProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color={buttonColor || "primary"}
      >
        {buttonText || title}
      </Button>
      <Dialog
        title="info-popup"
        onClose={handleClose}
        open={isOpen}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          {onSave && (
            <Button color="secondary" onClick={handleSave}>
              Save
            </Button>
          )}
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoPopup;
