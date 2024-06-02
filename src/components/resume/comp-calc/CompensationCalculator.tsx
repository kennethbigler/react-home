import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Typography } from "@mui/material";
import compCalcState, {
  CompEntry,
  compCalcReadOnlyState,
} from "../../../recoil/comp-calculator-state";
import CompDisplay from "./CompDisplay";
import CompEntryDialog from "./CompEntryDialog";

/** Compensation Calculator
 * -----     SALARY     -----
 * Date {DateObj}
 * Salary {number}
 * Bonus {number}
 * Stock (Adj) {number} - calculated
 * Stock {number} - calculated
 * Total {number} - calculated
 * Total (Adj) {number} - calculated
 * Net {number} - calculated
 * -----     STOCK     -----
 * Price Now {number} - number (V1) - API (V2)
 * Price Then {number} - number (V1) - API (V2)
 * Expires On {number} - YEARS
 * Grant Qty {number} - STOCKS
 * Grant Then - calculated
 * Grant Now - calculated
 */
const CompensationCalculator = () => {
  const [compEntries, setCompEntries] = useRecoilState(compCalcState);
  const compCalcEntries = useRecoilValue(compCalcReadOnlyState);
  const [open, setOpen] = React.useState(false);

  const openEntryModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const submitCompEntry = (newCompEntry: CompEntry) => {
    setCompEntries([...compEntries, newCompEntry]);
    handleClose();
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Comp Calculator
      </Typography>

      <CompDisplay
        compEntries={compEntries}
        compCalcEntries={compCalcEntries}
      />

      <Button onClick={openEntryModal}>New Entry</Button>
      <CompEntryDialog
        open={open}
        handleClose={handleClose}
        submitCompEntry={submitCompEntry}
      />
    </>
  );
};

export default CompensationCalculator;
