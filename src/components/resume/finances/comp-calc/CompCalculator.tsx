import { useEffect, useMemo, useState } from "react";
import { Alert } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import compCalcState, {
  compCalcRead,
  sortCompEntriesByDate,
} from "../../../../jotai/finances-atom";
import CompActions from "./CompActions";
import Graphs from "./graphs/Graphs";
import CompEntryDisplay from "./CompEntryDisplay";

const CompCalculator = () => {
  const [compEntries, setCompEntries] = useAtom(compCalcState);
  const compCalcEntries = useAtomValue(compCalcRead);

  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);

  useEffect(() => {
    const sorted = sortCompEntriesByDate(compEntries);
    if (
      sorted.some(
        (entry, index) => entry.entryDate !== compEntries[index]?.entryDate,
      )
    ) {
      setCompEntries(sorted);
    }
  }, [compEntries, setCompEntries]);

  const sortedCompEntries = useMemo(
    () => sortCompEntriesByDate(compEntries),
    [compEntries],
  );

  // entry open/closers
  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  return (
    <>
      {sortedCompEntries.length > 0 ? (
        <Graphs
          compEntries={sortedCompEntries}
          compCalcEntries={compCalcEntries}
        />
      ) : (
        <Alert severity="warning">
          Add a comp entry to see compensation data.
        </Alert>
      )}
      <CompActions
        compEntries={sortedCompEntries}
        setCompEntries={setCompEntries}
        openEntry={openEntry}
        setOpenEntry={setOpenEntry}
        editEntryIdx={editEntryIdx}
        setEditEntryIdx={setEditEntryIdx}
      />
      {sortedCompEntries.length > 0 && (
        <CompEntryDisplay
          compEntries={sortedCompEntries}
          compCalcEntries={compCalcEntries}
          onClick={openEditEntry}
        />
      )}
    </>
  );
};

export default CompCalculator;
