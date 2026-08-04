import { Alert } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import compCalcState, {
  compCalcRead,
  sortCompEntriesByDate,
} from "../../../../jotai/finances-atom";
import useEntryDialog from "../shared/useEntryDialog";
import useSortedEntries from "../shared/useSortedEntries";
import CompActions from "./CompActions";
import Graphs from "./graphs/Graphs";
import CompEntryDisplay from "./CompEntryDisplay";

const CompCalculator = () => {
  const [compEntries, setCompEntries] = useAtom(compCalcState);
  const compCalcEntries = useAtomValue(compCalcRead);
  const sortedCompEntries = useSortedEntries(
    compEntries,
    setCompEntries,
    sortCompEntriesByDate,
  );
  const entryDialog = useEntryDialog();

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
        entryDialog={entryDialog}
      />
      {sortedCompEntries.length > 0 && (
        <CompEntryDisplay
          compEntries={sortedCompEntries}
          compCalcEntries={compCalcEntries}
          onClick={entryDialog.openEdit}
        />
      )}
    </>
  );
};

export default CompCalculator;
