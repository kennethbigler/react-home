import { useState } from "react";

interface ConfirmDeleteState {
  open: boolean;
  request: () => void;
  cancel: () => void;
  confirm: () => void;
}

/** Open/confirm flow for the shared ConfirmDeleteDialog. */
const useConfirmDelete = (onDelete: () => void): ConfirmDeleteState => {
  const [open, setOpen] = useState(false);

  const request = () => setOpen(true);
  const cancel = () => setOpen(false);
  const confirm = () => {
    onDelete();
    setOpen(false);
  };

  return { open, request, cancel, confirm };
};

export default useConfirmDelete;
