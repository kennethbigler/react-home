import { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  type NetWorthEntry,
  mergeNetWorthCategoryAmounts,
  sortNetWorthEntriesByDate,
  syncNetWorthEntryAmounts,
} from "../../../../jotai/finances-atom";
import type { EntryDialogState } from "../shared/useEntryDialog";
import NetWorthEntryDialog from "./NetWorthEntryDialog";
import CategoriesDialog, { type CategoryMerge } from "./CategoriesDialog";

interface NetWorthActionsProps {
  entries: NetWorthEntry[];
  setEntries: (e: NetWorthEntry[]) => void;
  categories: string[];
  setCategories: (c: string[]) => void;
  entryDialog: EntryDialogState;
}

const NetWorthActions = ({
  entries,
  setEntries,
  categories,
  setCategories,
  entryDialog,
}: NetWorthActionsProps) => {
  const [openCategories, setOpenCategories] = useState(false);
  const closeCategoriesModal = () => setOpenCategories(false);
  const openCategoriesModal = () => setOpenCategories(true);

  const persistEntries = (next: NetWorthEntry[]) => {
    setEntries(sortNetWorthEntriesByDate(next));
  };

  const addEntry = (entry: NetWorthEntry) => {
    const next = [...entries];
    if (entryDialog.editIdx === -1) {
      next.push(entry);
    } else {
      next[entryDialog.editIdx] = entry;
    }
    persistEntries(next);
    entryDialog.close();
  };

  const removeEntry = () => {
    persistEntries(entries.filter((_, i) => i !== entryDialog.editIdx));
    entryDialog.close();
  };

  const saveCategories = (
    nextCategories: string[],
    mappings: { name: string; previousName?: string }[],
    merges: CategoryMerge[],
  ) => {
    const merged = mergeNetWorthCategoryAmounts(entries, merges);
    setCategories(nextCategories);
    persistEntries(syncNetWorthEntryAmounts(merged, mappings));
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
          onSave={saveCategories}
        />
      )}
      {entryDialog.open && (
        <NetWorthEntryDialog
          open={entryDialog.open}
          entry={isEditingEntry ? entries[entryDialog.editIdx] : undefined}
          entries={entries}
          categories={categories}
          onClose={entryDialog.close}
          addEntry={addEntry}
          onDelete={isEditingEntry ? removeEntry : undefined}
        />
      )}
    </>
  );
};

export default NetWorthActions;
