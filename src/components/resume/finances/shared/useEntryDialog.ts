import { useState } from "react";

export interface EntryDialogState {
  open: boolean;
  /** Index of the entry being edited, or -1 when adding a new entry. */
  editIdx: number;
  openNew: () => void;
  openEdit: (index: number) => () => void;
  close: () => void;
}

/** Open/close state for the add-or-edit entry dialogs. */
const useEntryDialog = (): EntryDialogState => {
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);

  const openNew = () => {
    setEditIdx(-1);
    setOpen(true);
  };
  const openEdit = (index: number) => () => {
    setEditIdx(index);
    setOpen(true);
  };
  const close = () => setOpen(false);

  return { open, editIdx, openNew, openEdit, close };
};

export default useEntryDialog;
