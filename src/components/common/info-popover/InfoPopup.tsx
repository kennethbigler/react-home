import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import useOpenState from "../../../hooks/useOpenState";
import { MuiColors } from "../types";

interface InfoPopupProps {
  /** popup content */
  children: React.ReactNode | React.ReactNodeArray;
  /** title content */
  title: string | React.ReactElement;
  /** button content */
  buttonText?: string | React.ReactElement;
  /** set the color of the button */
  buttonColor?: MuiColors;
}

const InfoPopup = (props: InfoPopupProps): React.ReactElement => {
  const [isOpen, handleOpen, handleClose] = useOpenState();
  const { buttonText, title, children, buttonColor } = props;

  return (
    <>
      <Button
        onClick={handleOpen as React.MouseEventHandler}
        variant="contained"
        color={buttonColor || "primary"}
      >
        {buttonText || title}
      </Button>
      <Dialog
        title="info-popup"
        onClose={handleClose as React.MouseEventHandler}
        open={isOpen}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={handleClose as React.MouseEventHandler}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoPopup;
