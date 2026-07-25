import { Dispatch, SetStateAction } from "react";
import { Box, Button } from "@mui/material";
import {
  NetWorthEntry,
  mergeNetWorthCategoryAmounts,
  sortNetWorthEntriesByDate,
  syncNetWorthEntryAmounts,
} from "../../../../jotai/finances-atom";
import NetWorthEntryDialog from "./NetWorthEntryDialog";
import CategoriesDialog, { CategoryMerge } from "./CategoriesDialog";

interface NetWorthActionsProps {
  entries: NetWorthEntry[];
  setEntries: (e: NetWorthEntry[]) => void;
  categories: string[];
  setCategories: (c: string[]) => void;
  editEntryIdx: number;
  openEntry: boolean;
  setEditEntryIdx: Dispatch<SetStateAction<number>>;
  setOpenEntry: Dispatch<SetStateAction<boolean>>;
  openCategories: boolean;
  setOpenCategories: Dispatch<SetStateAction<boolean>>;
}

const NetWorthActions = ({
  entries,
  setEntries,
  categories,
  setCategories,
  openEntry,
  setOpenEntry,
  editEntryIdx,
  setEditEntryIdx,
  openCategories,
  setOpenCategories,
}: NetWorthActionsProps) => {
  const closeEntryModal = () => setOpenEntry(false);
  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };
  const closeCategoriesModal = () => setOpenCategories(false);
  const openCategoriesModal = () => setOpenCategories(true);

  const persistEntries = (next: NetWorthEntry[]) => {
    setEntries(sortNetWorthEntriesByDate(next));
  };

  const addEntry = (entry: NetWorthEntry) => {
    const next = [...entries];
    if (editEntryIdx === -1) {
      next.push(entry);
    } else {
      next[editEntryIdx] = entry;
    }
    persistEntries(next);
    closeEntryModal();
  };

  const removeEntry = () => {
    persistEntries(entries.filter((_, i) => i !== editEntryIdx));
    closeEntryModal();
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

  return (
    <>
      <Box sx={{ marginTop: 1.25, marginBottom: 1.25 }}>
        <Button onClick={openNewEntry} disabled={categories.length === 0}>
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
      {openEntry && (
        <NetWorthEntryDialog
          open={openEntry}
          entry={editEntryIdx !== -1 ? entries[editEntryIdx] : undefined}
          entries={entries}
          categories={categories}
          onClose={closeEntryModal}
          addEntry={addEntry}
          onDelete={editEntryIdx !== -1 ? removeEntry : undefined}
        />
      )}
    </>
  );
};

export default NetWorthActions;
