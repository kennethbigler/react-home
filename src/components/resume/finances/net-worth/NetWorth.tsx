import { useMemo } from "react";
import { Alert } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import {
  netWorthAtom,
  netWorthCategoriesAtom,
  netWorthRead,
  sortNetWorthEntriesByDate,
} from "../../../../jotai/finances-atom";
import useEntryDialog from "../shared/useEntryDialog";
import useSortedEntries from "../shared/useSortedEntries";
import NetWorthActions from "./NetWorthActions";
import Graphs from "./graphs/Graphs";
import NetWorthEntryDisplay from "./NetWorthEntryDisplay";
import { sortCategoriesByFinalEntry } from "./sortCategories";

const NetWorth = () => {
  const [entries, setEntries] = useAtom(netWorthAtom);
  const [categories, setCategories] = useAtom(netWorthCategoriesAtom);
  const calcEntries = useAtomValue(netWorthRead);
  const sortedEntries = useSortedEntries(
    entries,
    setEntries,
    sortNetWorthEntriesByDate,
  );
  const entryDialog = useEntryDialog();

  const sortedCategories = useMemo(
    () => sortCategoriesByFinalEntry(categories, sortedEntries),
    [categories, sortedEntries],
  );

  return (
    <>
      {sortedEntries.length > 0 ? (
        <Graphs
          entries={sortedEntries}
          calcEntries={calcEntries}
          categories={sortedCategories}
        />
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Add a net worth entry to see net worth data.
        </Alert>
      )}
      <NetWorthActions
        entries={sortedEntries}
        setEntries={setEntries}
        categories={sortedCategories}
        setCategories={setCategories}
        entryDialog={entryDialog}
      />
      {sortedEntries.length > 0 && (
        <NetWorthEntryDisplay
          entries={sortedEntries}
          calcEntries={calcEntries}
          categories={sortedCategories}
          onClick={entryDialog.openEdit}
        />
      )}
    </>
  );
};

export default NetWorth;
