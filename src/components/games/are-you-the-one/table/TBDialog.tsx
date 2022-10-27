import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

export interface TBDialogProps {
  open: boolean;
  content: string;
  onMatch: () => void;
  onNoMatch: () => void;
  onCancel: () => void;
}

const TBDialog = ({
  open,
  content,
  onMatch,
  onNoMatch,
  onCancel,
}: TBDialogProps) => (
  <Dialog onClose={onCancel} open={open}>
    <DialogTitle>TB Result</DialogTitle>
    <DialogContent>Are {content} a perfect match?</DialogContent>
    <DialogActions>
      <Button onClick={onMatch}>Match</Button>
      <Button onClick={onNoMatch} color="error">
        No Match
      </Button>
      <Button onClick={onCancel} color="warning">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default TBDialog;
