import { Alert } from "@mui/material";
import compCalcAtom, { compCalcRead } from "@/jotai/comp-calc-atom";
import useFinanceEntries from "../shared/useFinanceEntries";
import CompActions from "./CompActions";
import Graphs from "./graphs/Graphs";
import CompEntryDisplay from "./CompEntryDisplay";

const CompCalculator = () => {
  const {
    entries: compEntries,
    calcEntries: compCalcEntries,
    entryDialog,
    saveEntry,
    removeEntry,
  } = useFinanceEntries(compCalcAtom, compCalcRead);

  return (
    <>
      {compEntries.length > 0 ? (
        <Graphs compEntries={compEntries} compCalcEntries={compCalcEntries} />
      ) : (
        <Alert severity="warning">
          Add a comp entry to see compensation data.
        </Alert>
      )}
      <CompActions
        compEntries={compEntries}
        entryDialog={entryDialog}
        saveCompEntry={saveEntry}
        removeCompEntry={removeEntry}
      />
      {compEntries.length > 0 && (
        <CompEntryDisplay
          compEntries={compEntries}
          compCalcEntries={compCalcEntries}
          onClick={entryDialog.openEdit}
        />
      )}
    </>
  );
};

export default CompCalculator;
