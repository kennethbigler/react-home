import { useState, ReactElement, ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { MuiColors } from "../types";

interface InfoPopupProps {
  /** set button variant */
  buttonVariant?: "text" | "contained" | "outlined";
  /** set the color of the button */
  buttonColor?: MuiColors;
  /** button content */
  buttonText?: string | ReactElement;
  /** button full width */
  fullWidth?: boolean;
  /** title content */
  title: string | ReactElement;
  /** popup content */
  children: ReactNode | ReactNode[];
  /** set the color of the button */
  onSave?: () => void;
}

const InfoPopup = ({
  buttonColor = "primary",
  buttonText,
  buttonVariant = "contained",
  fullWidth = false,
  title,
  children,
  onSave,
}: InfoPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
        color={buttonColor}
        fullWidth={fullWidth}
        variant={buttonVariant}
        onClick={handleOpen}
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
