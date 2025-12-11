import { useState, ReactElement, ReactNode } from "react";
import { MuiColors } from "../types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

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
  /** max width of the popup */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
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
  maxWidth = "md",
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
        maxWidth={maxWidth}
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
