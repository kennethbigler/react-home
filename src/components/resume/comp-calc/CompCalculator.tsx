import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import compCalcState, {
  compCalcRead,
} from "../../../jotai/comp-calculator-atom";
import CompHeader from "./CompHeader";
import Graphs from "./graphs/Graphs";
import CompEntryDisplay from "./CompEntryDisplay";

const CompCalculator = () => {
  const [compEntries, setCompEntries] = useAtom(compCalcState);
  const compCalcEntries = useAtomValue(compCalcRead);

  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);

  // entry open/closers
  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  return (
    <>
      <CompHeader
        compEntries={compEntries}
        setCompEntries={setCompEntries}
        openEntry={openEntry}
        setOpenEntry={setOpenEntry}
        editEntryIdx={editEntryIdx}
        setEditEntryIdx={setEditEntryIdx}
      />
      {compEntries.length > 0 && (
        <>
          <Graphs compEntries={compEntries} compCalcEntries={compCalcEntries} />
          <CompEntryDisplay
            compEntries={compEntries}
            compCalcEntries={compCalcEntries}
            onClick={openEditEntry}
          />
        </>
      )}
    </>
  );
};

export default CompCalculator;
