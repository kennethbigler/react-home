import { useState } from "react";
import { Box, Button } from "@mui/material";
import type { NetWorthEntry } from "@/jotai/net-worth-atom";
import type { EntryDialogState } from "../shared/useEntryDialog";
import NetWorthEntryDialog from "./NetWorthEntryDialog";
import CategoriesDialog, { type CategoryMerge } from "./CategoriesDialog";

interface NetWorthActionsProps {
  entries: NetWorthEntry[];
  categories: string[];
  entryDialog: EntryDialogState;
  saveEntry: (entry: NetWorthEntry) => void;
  removeEntry: () => void;
  saveCategories: (
    nextCategories: string[],
    mappings: { name: string; previousName?: string }[],
    merges: CategoryMerge[],
  ) => void;
}

const NetWorthActions = ({
  entries,
  categories,
  entryDialog,
  saveEntry,
  removeEntry,
  saveCategories,
}: NetWorthActionsProps) => {
  const [openCategories, setOpenCategories] = useState(false);
  const closeCategoriesModal = () => setOpenCategories(false);
  const openCategoriesModal = () => setOpenCategories(true);

  const handleSaveCategories = (
    nextCategories: string[],
    mappings: { name: string; previousName?: string }[],
    merges: CategoryMerge[],
  ) => {
    saveCategories(nextCategories, mappings, merges);
    closeCategoriesModal();
  };

  const isEditingEntry = entryDialog.editIdx !== -1;

  return (
    <>
      <Box sx={{ marginTop: 1.25, marginBottom: 1.25 }}>
        <Button
          onClick={entryDialog.openNew}
          disabled={categories.length === 0}
        >
          + Entry
        </Button>
        <Button onClick={openCategoriesModal}>Set Categories</Button>
      </Box>
      {openCategories && (
        <CategoriesDialog
          open={openCategories}
          categories={categories}
          hasEntries={entries.length > 0}
          onClose={closeCategoriesModal}
          onSave={handleSaveCategories}
        />
      )}
      {entryDialog.open && (
        <NetWorthEntryDialog
          open={entryDialog.open}
          entry={isEditingEntry ? entries[entryDialog.editIdx] : undefined}
          entries={entries}
          categories={categories}
          onClose={entryDialog.close}
          addEntry={saveEntry}
          onDelete={isEditingEntry ? removeEntry : undefined}
        />
      )}
    </>
  );
};

export default NetWorthActions;
