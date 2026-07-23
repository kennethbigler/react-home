import { useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  netWorthAtom,
  netWorthCategoriesAtom,
  netWorthRead,
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

  const sortedCategories = useMemo(
    () => sortCategoriesByFinalEntry(categories, entries),
    [categories, entries],
  );

  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  return (
    <>
      {entries.length > 0 && (
        <Graphs
          entries={entries}
          calcEntries={calcEntries}
          categories={sortedCategories}
        />
      )}
      <NetWorthActions
        entries={entries}
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
      {entries.length > 0 && (
        <NetWorthEntryDisplay
          entries={entries}
          calcEntries={calcEntries}
          categories={sortedCategories}
          onClick={openEditEntry}
        />
      )}
    </>
  );
};

export default NetWorth;
