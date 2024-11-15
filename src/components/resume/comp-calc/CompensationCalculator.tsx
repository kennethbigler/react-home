import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Typography } from "@mui/material";
import compCalcState, {
  CompEntry,
  compCalcReadOnlyState,
} from "../../../recoil/comp-calculator-state";
import CompDisplay from "./CompDisplay";
import CompEntryDialog from "./CompEntryDialog";

const CompensationCalculator = () => {
  const [compEntries, setCompEntries] = useRecoilState(compCalcState);
  const compCalcEntries = useRecoilValue(compCalcReadOnlyState);
  const [open, setOpen] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState(-1);

  const closeEntryModal = () => setOpen(false);

  const openNewEntry = () => {
    setEditIdx(-1);
    setOpen(true);
  };

  const openEditEntry = (i: number) => () => {
    setEditIdx(i);
    setOpen(true);
  };

  const addCompEntry = (compEntry: CompEntry) => {
    const newCompEntries = [...compEntries];
    if (editIdx === -1) {
      newCompEntries.push(compEntry);
    } else {
      newCompEntries[editIdx] = compEntry;
    }
    setCompEntries(newCompEntries);
    closeEntryModal();
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Comp Calculator
      </Typography>

      <CompDisplay
        compEntries={compEntries}
        compCalcEntries={compCalcEntries}
        openEntryModal={openEditEntry}
      />

      <Button onClick={openNewEntry}>New Entry</Button>
      <CompEntryDialog
        open={open}
        compEntry={editIdx !== -1 ? compEntries[editIdx] : undefined}
        onClose={closeEntryModal}
        addCompEntry={addCompEntry}
      />
    </>
  );
};

export default CompensationCalculator;
