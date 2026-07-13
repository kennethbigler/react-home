import { useState } from "react";
import ExpenseEntryDialog from "./ExpenseEntryDialog";
import ExpenseEntryDisplay from "./ExpenseEntryDisplay";
import {
  budgetAtom,
  budgetCategoryColorsAtom,
  budgetFlowRead,
  ExpenseEntry,
} from "../../../../jotai/finances-atom";
import { useAtom, useAtomValue } from "jotai";
import { Button, FormControlLabel, Stack, Switch } from "@mui/material";

import { normalizeCategoryKey } from "./helpers";

const Budgeting = () => {
  const [expenseEntries, setExpenseEntries] = useAtom(budgetAtom);
  const [, setCategoryColors] = useAtom(budgetCategoryColorsAtom);
  const budgetState = useAtomValue(budgetFlowRead);
  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );
  const [hideTaxes, setHideTaxes] = useState(false);

  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };

  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  const handleClose = () => setOpenEntry(false);

  const addExpenseEntry = (expenseEntry: ExpenseEntry) => {
    const newExpenseEntries = [...expenseEntries];
    if (editEntryIdx === -1) {
      newExpenseEntries.push(expenseEntry);
    } else {
      newExpenseEntries[editEntryIdx] = expenseEntry;
    }
    setExpenseEntries(newExpenseEntries);
    handleClose();
  };

  const removeExpenseEntry = () => {
    const deletedCategoryKey = normalizeCategoryKey(
      expenseEntries[editEntryIdx]?.category ?? "",
    );
    const newExpenseEntries = expenseEntries.filter(
      (_, index) => index !== editEntryIdx,
    );
    const categoryStillExists = newExpenseEntries.some(
      (entry) => normalizeCategoryKey(entry.category) === deletedCategoryKey,
    );

    setExpenseEntries(newExpenseEntries);

    if (!categoryStillExists) {
      if (selectedCategoryKey === deletedCategoryKey) {
        setSelectedCategoryKey(null);
      }

      setCategoryColors((currentColors) => {
        const { [deletedCategoryKey]: _removedColor, ...remainingColors } =
          currentColors;
        return remainingColors;
      });
    }

    handleClose();
  };

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <Button onClick={openNewEntry}>+ Expense</Button>
        <FormControlLabel
          control={
            <Switch
              checked={hideTaxes}
              onChange={(event) => setHideTaxes(event.target.checked)}
              slotProps={{ input: { "aria-label": "Hide taxes" } }}
            />
          }
          label="Hide taxes"
        />
      </Stack>
      <ExpenseEntryDisplay
        hasCompData={budgetState.hasCompData}
        flow={budgetState.flow}
        expenseEntries={budgetState.expenseEntries}
        selectedCategoryKey={selectedCategoryKey}
        hideTaxes={hideTaxes}
        onCategorySelect={setSelectedCategoryKey}
        onClick={openEditEntry}
      />
      {openEntry && (
        <ExpenseEntryDialog
          key={editEntryIdx === -1 ? "new" : editEntryIdx}
          open={openEntry}
          onClose={handleClose}
          addExpenseEntry={addExpenseEntry}
          onDelete={editEntryIdx !== -1 ? removeExpenseEntry : undefined}
          expenseEntry={
            editEntryIdx !== -1 ? expenseEntries[editEntryIdx] : undefined
          }
        />
      )}
    </div>
  );
};

export default Budgeting;
