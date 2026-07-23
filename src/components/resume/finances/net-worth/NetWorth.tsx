import { useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  netWorthAtom,
  netWorthCategoriesAtom,
  netWorthRead,
  sortNetWorthEntriesByDate,
} from "../../../../jotai/finances-atom";
import NetWorthActions from "./NetWorthActions";
import Graphs from "./graphs/Graphs";
import NetWorthEntryDisplay from "./NetWorthEntryDisplay";
import { sortCategoriesByFinalEntry } from "./sortCategories";

const NetWorth = () => {
  const [entries, setEntries] = useAtom(netWorthAtom);
  const [categories, setCategories] = useAtom(netWorthCategoriesAtom);
  const calcEntries = useAtomValue(netWorthRead);

  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);
  const [openCategories, setOpenCategories] = useState(false);

  // Persist chronological order for legacy insertion-ordered storage.
  useEffect(() => {
    const sorted = sortNetWorthEntriesByDate(entries);
    if (sorted.some((entry, i) => entry.entryDate !== entries[i]?.entryDate)) {
      setEntries(sorted);
    }
  }, [entries, setEntries]);

  const sortedEntries = useMemo(
    () => sortNetWorthEntriesByDate(entries),
    [entries],
  );

  const sortedCategories = useMemo(
    () => sortCategoriesByFinalEntry(categories, sortedEntries),
    [categories, sortedEntries],
  );

  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  return (
    <>
      {sortedEntries.length > 0 && (
        <Graphs
          entries={sortedEntries}
          calcEntries={calcEntries}
          categories={sortedCategories}
        />
      )}
      <NetWorthActions
        entries={sortedEntries}
        setEntries={setEntries}
        categories={sortedCategories}
        setCategories={setCategories}
        openEntry={openEntry}
        setOpenEntry={setOpenEntry}
        editEntryIdx={editEntryIdx}
        setEditEntryIdx={setEditEntryIdx}
        openCategories={openCategories}
        setOpenCategories={setOpenCategories}
      />
      {sortedEntries.length > 0 && (
        <NetWorthEntryDisplay
          entries={sortedEntries}
          calcEntries={calcEntries}
          categories={sortedCategories}
          onClick={openEditEntry}
        />
      )}
    </>
  );
};

export default NetWorth;
