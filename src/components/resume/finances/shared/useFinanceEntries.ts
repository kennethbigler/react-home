import { useAtom, useAtomValue, type Atom, type WritableAtom } from "jotai";
import sortByEntryDate from "@/apis/sortByEntryDate";
import useEntryDialog, { type EntryDialogState } from "./useEntryDialog";
import useSortedEntries from "./useSortedEntries";

interface DatedEntry {
  entryDate: string;
}

export interface FinanceEntriesState<TEntry extends DatedEntry, TCalcEntry> {
  /** Chronologically sorted persisted entries. */
  entries: TEntry[];
  /** Derived read-model entries aligned with `entries`. */
  calcEntries: TCalcEntry[];
  entryDialog: EntryDialogState;
  /** Persists entries in chronological order. */
  persistEntries: (next: TEntry[]) => void;
  /** Adds or updates the dialog's entry, then closes the dialog. */
  saveEntry: (entry: TEntry) => void;
  /** Removes the dialog's entry, then closes the dialog. */
  removeEntry: () => void;
}

/**
 * Shared preamble and CRUD actions for entry-list finance features
 * (net worth, comp calculator): sorted persisted entries, the derived
 * read-model, and the add-or-edit entry dialog state.
 */
const useFinanceEntries = <TEntry extends DatedEntry, TCalcEntry>(
  entriesAtom: WritableAtom<TEntry[], [TEntry[]], void>,
  readAtom: Atom<TCalcEntry[]>,
): FinanceEntriesState<TEntry, TCalcEntry> => {
  const [rawEntries, setEntries] = useAtom(entriesAtom);
  const calcEntries = useAtomValue(readAtom);
  const entries = useSortedEntries(rawEntries, setEntries, sortByEntryDate);
  const entryDialog = useEntryDialog();

  const persistEntries = (next: TEntry[]) => {
    setEntries(sortByEntryDate(next));
  };

  const saveEntry = (entry: TEntry) => {
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

  return {
    entries,
    calcEntries,
    entryDialog,
    persistEntries,
    saveEntry,
    removeEntry,
  };
};

export default useFinanceEntries;
