import { Alert } from "@mui/material";
import NetWorthActions from "./NetWorthActions";
import Graphs from "./graphs/Graphs";
import NetWorthEntryDisplay from "./NetWorthEntryDisplay";
import useNetWorthEntries from "./useNetWorthEntries";

const NetWorth = () => {
  const {
    entries,
    calcEntries,
    categories,
    entryDialog,
    saveEntry,
    removeEntry,
    saveCategories,
  } = useNetWorthEntries();

  return (
    <>
      {entries.length > 0 ? (
        <Graphs
          entries={entries}
          calcEntries={calcEntries}
          categories={categories}
        />
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Add a net worth entry to see net worth data.
        </Alert>
      )}
      <NetWorthActions
        entries={entries}
        categories={categories}
        entryDialog={entryDialog}
        saveEntry={saveEntry}
        removeEntry={removeEntry}
        saveCategories={saveCategories}
      />
      {entries.length > 0 && (
        <NetWorthEntryDisplay
          entries={entries}
          calcEntries={calcEntries}
          categories={categories}
          onClick={entryDialog.openEdit}
        />
      )}
    </>
  );
};

export default NetWorth;
